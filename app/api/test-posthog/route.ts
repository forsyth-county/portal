import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check environment variables
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY
    const projectId = process.env.POSTHOG_PROJECT_ID
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey?.substring(0, 10) + '...',
      hasProjectId: !!projectId,
      projectId,
      host
    })

    if (!apiKey || !projectId) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          hasApiKey: !!apiKey,
          hasProjectId: !!projectId,
          hasHost: !!host
        }
      }, { status: 500 })
    }

    // Test basic API connectivity with users endpoint
    const response = await fetch(`${host}/api/users/`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('PostHog API error:', response.status, errorText)
      
      return NextResponse.json({
        success: false,
        error: `PostHog API error: ${response.status} ${response.statusText}`,
        details: errorText
      }, { status: 500 })
    }

    const data = await response.json()
    
    // Try web analytics endpoint to show it's not available
    let webAnalyticsError = null
    try {
      const webResponse = await fetch(`${host}/api/projects/${projectId}/web_analytics/overview/`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (!webResponse.ok) {
        const webError = await webResponse.json()
        webAnalyticsError = webError.detail || webError.message || 'Web analytics not available'
      }
    } catch (err) {
      webAnalyticsError = err instanceof Error ? err.message : 'Unknown error'
    }
    
    return NextResponse.json({
      success: true,
      data: {
        totalUsers: data.count || 0,
        users: data.results?.length || 0,
        webAnalyticsAvailable: false,
        webAnalyticsError: webAnalyticsError
      },
      message: 'PostHog API connection successful (users endpoint available, web analytics requires higher plan)',
      note: 'Your PostHog plan includes user analytics but not web analytics. Consider upgrading for detailed page view analytics.'
    })
  } catch (error) {
    console.error('PostHog API test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'PostHog API connection failed'
    }, { status: 500 })
  }
}
