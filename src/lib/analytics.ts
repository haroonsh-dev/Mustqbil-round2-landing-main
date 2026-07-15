type EventName = 'cta_click' | 'form_submit' | 'page_view';

export function trackEvent(eventName: EventName, properties: Record<string, any> = {}) {
  try {
    if (typeof window === 'undefined') return;
    
    // In a real app, this would be Segment, Amplitude, Google Analytics, etc.
    const event = {
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
    };

    console.log(`📊 [Analytics Event]: ${eventName}`, properties);

    // Store in localStorage mock analytics array
    const existingEvents = JSON.parse(localStorage.getItem('mock_analytics') || '[]');
    existingEvents.push(event);
    localStorage.setItem('mock_analytics', JSON.stringify(existingEvents));
  } catch (err) {
    console.error('Failed to track event', err);
  }
}
