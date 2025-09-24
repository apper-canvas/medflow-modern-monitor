import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong while loading the data.", 
  onRetry,
  title = "Unable to Load Data"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
      </div>
      
      <div className="max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="primary">
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          <Button variant="outline">
            <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 max-w-md">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
          <ApperIcon name="Info" className="h-4 w-4 mr-2 text-blue-500" />
          Troubleshooting Tips
        </h4>
        <ul className="text-sm text-gray-600 space-y-1 text-left">
          <li>• Check your internet connection</li>
          <li>• Refresh the page and try again</li>
          <li>• Contact IT support if the problem persists</li>
        </ul>
      </div>
    </div>
  )
}

export default Error