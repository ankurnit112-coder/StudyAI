"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  Copy, 
  ExternalLink, 
  RefreshCw,
  AlertTriangle,
  Loader2
} from "lucide-react"

interface TableStatus {
  table: string
  status: 'exists' | 'missing' | 'error'
  error?: string
  count?: number
}

interface MigrationData {
  status: string
  message: string
  supabaseUrl: string
  dashboardUrl: string
  summary: {
    total: number
    existing: number
    missing: number
    needsMigration: boolean
  }
  tables: TableStatus[]
  migrationSQL: string
  instructions: {
    title: string
    steps: Array<{
      step: number
      title: string
      description: string
      action?: string
    }>
  }
}

export default function MigratePage() {
  const [migrationData, setMigrationData] = useState<MigrationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const fetchMigrationData = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch('/api/migrate-db')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch migration data')
      }
      
      setMigrationData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load migration data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMigrationData()
  }, [])

  const copyToClipboard = async () => {
    if (!migrationData?.migrationSQL) return
    
    try {
      await navigator.clipboard.writeText(migrationData.migrationSQL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'exists':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'exists':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Ready</Badge>
      case 'missing':
        return <Badge variant="destructive">Missing</Badge>
      default:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Error</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading migration data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Database className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Database Migration</h1>
          <p className="mt-2 text-gray-600">Set up your StudyAI database tables</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {migrationData && (
          <>
            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Database Status</span>
                </CardTitle>
                <CardDescription>
                  Current status of your Supabase database tables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{migrationData.summary.total}</div>
                    <div className="text-sm text-gray-600">Total Tables</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{migrationData.summary.existing}</div>
                    <div className="text-sm text-gray-600">Existing</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{migrationData.summary.missing}</div>
                    <div className="text-sm text-gray-600">Missing</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {migrationData.tables.map((table) => (
                    <div key={table.table} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(table.status)}
                        <span className="font-medium">{table.table}</span>
                      </div>
                      {getStatusBadge(table.status)}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button onClick={fetchMigrationData} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Status
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={migrationData.dashboardUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Supabase Dashboard
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Migration Instructions */}
            {migrationData.summary.needsMigration && (
              <Card>
                <CardHeader>
                  <CardTitle>Migration Instructions</CardTitle>
                  <CardDescription>
                    Follow these steps to set up your database tables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {migrationData.instructions.steps.map((step) => (
                      <div key={step.step} className="flex space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          {step.action && (
                            <Button asChild variant="link" size="sm" className="p-0 h-auto mt-1">
                              <a href={step.action} target="_blank" rel="noopener noreferrer">
                                {step.action}
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SQL Migration Code */}
            {migrationData.summary.needsMigration && (
              <Card>
                <CardHeader>
                  <CardTitle>Migration SQL</CardTitle>
                  <CardDescription>
                    Copy this SQL and run it in your Supabase SQL Editor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                      <code>{migrationData.migrationSQL}</code>
                    </pre>
                    <Button
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2"
                      size="sm"
                      variant="secondary"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy SQL
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Message */}
            {!migrationData.summary.needsMigration && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  🎉 All database tables are ready! Your authentication system should work perfectly now.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
    </div>
  )
}