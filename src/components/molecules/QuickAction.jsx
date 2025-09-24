import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const QuickAction = ({ icon, title, description, onClick, variant = "outline" }) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className="p-4 h-auto flex flex-col items-center text-center space-y-2 hover:bg-gradient-to-r hover:from-primary-50 hover:to-cyan-50 hover:border-primary-300"
    >
      <div className="p-3 rounded-full bg-gradient-to-r from-primary-100 to-cyan-100">
        <ApperIcon name={icon} className="h-6 w-6 text-primary-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Button>
  )
}

export default QuickAction