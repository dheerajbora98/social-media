interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
  userId?: string
}

class AnalyticsService {
  private static instance: AnalyticsService
  private events: AnalyticsEvent[] = []
  private userId: string | null = null

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  setUserId(userId: string): void {
    this.userId = userId
  }

  track(eventName: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      userId: this.userId || undefined,
    }

    this.events.push(event)
    console.log("Analytics Event:", event)

    // In a real app, you would send this to your analytics service
    this.sendToAnalyticsService(event)
  }

  trackScreenView(screenName: string): void {
    this.track("screen_view", { screen_name: screenName })
  }

  trackUserAction(action: string, target?: string, properties?: Record<string, any>): void {
    this.track("user_action", {
      action,
      target,
      ...properties,
    })
  }

  trackPerformance(metric: string, value: number, unit = "ms"): void {
    this.track("performance", {
      metric,
      value,
      unit,
    })
  }

  trackError(error: Error, context?: string): void {
    this.track("error", {
      error_message: error.message,
      error_stack: error.stack,
      context,
    })
  }

  private async sendToAnalyticsService(event: AnalyticsEvent): Promise<void> {
    // Simulate sending to analytics service
    // In a real app, you would integrate with services like:
    // - Google Analytics
    // - Mixpanel
    // - Amplitude
    // - Custom analytics endpoint

    try {
      // Example: await fetch('/api/analytics', { method: 'POST', body: JSON.stringify(event) })
      console.log("Sent to analytics service:", event)
    } catch (error) {
      console.error("Failed to send analytics event:", error)
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  clearEvents(): void {
    this.events = []
  }
}

export const analyticsService = AnalyticsService.getInstance()
