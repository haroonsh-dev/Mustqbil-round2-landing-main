// Supabase Edge Function: send-invite
// Receives { workspace_id, emails } and inserts members + logs a mock email dispatch.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Verify the caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Create a Supabase client scoped to the caller's JWT
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // 3. Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Parse the request body
    const { workspace_id, emails } = await req.json();

    if (!workspace_id || !emails || !Array.isArray(emails)) {
      return new Response(JSON.stringify({ error: "workspace_id and emails[] are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Verify the caller owns this workspace
    const { data: workspace, error: wsError } = await supabase
      .from("workspaces")
      .select("id, owner_id")
      .eq("id", workspace_id)
      .single();

    if (wsError || !workspace || workspace.owner_id !== user.id) {
      return new Response(JSON.stringify({ error: "You are not the owner of this workspace" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 6. Filter valid emails and insert into workspace_members
    const validEmails = emails
      .map((e: string) => e.trim().toLowerCase())
      .filter((e: string) => e.length > 0 && e.includes("@"));

    if (validEmails.length === 0) {
      return new Response(JSON.stringify({ message: "No valid emails provided", invited: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const membersToInsert = validEmails.map((email: string) => ({
      workspace_id,
      email,
      role: "member",
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("workspace_members")
      .upsert(membersToInsert, { onConflict: "workspace_id,email" })
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 7. Mock email dispatch (in production, replace with Resend/SendGrid/SES)
    for (const email of validEmails) {
      console.log(`📧 [MOCK EMAIL] Invitation sent to ${email} for workspace ${workspace_id}`);
      console.log(`   Subject: You've been invited to join a Clarity workspace`);
      console.log(`   Body: ${user.email} has invited you to collaborate. Click here to join.`);
    }

    return new Response(
      JSON.stringify({
        message: `Successfully invited ${validEmails.length} team member(s)`,
        invited: validEmails.length,
        emails: validEmails,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
