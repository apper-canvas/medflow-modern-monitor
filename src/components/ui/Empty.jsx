import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  message = "No data available at the moment.",
  actionText = "Add New Record",
  onAction,
  icon = "Database"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="h-10 w-10 text-gray-400" />
      </div>
      
      <div className="max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Records Found</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        {onAction && (
          <Button onClick={onAction} variant="primary" className="mb-4">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionText}
          </Button>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline">
            <ApperIcon name="Search" className="h-4 w-4 mr-2" />
            Search Records
          </Button>
          <Button variant="ghost">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <ApperIcon name="Lightbulb" className="h-4 w-4 mr-2 text-blue-600" />
          Quick Actions
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 text-left">
          <li>• Add a new patient record</li>
          <li>• Schedule an appointment</li>
          <li>• Import data from another system</li>
        </ul>
      </div>
    </div>
  )
}

export default Empty