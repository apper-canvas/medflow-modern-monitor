import React, { useContext } from "react"
import { useSelector } from 'react-redux'
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"
import { AuthContext } from "../../App"

const Header = ({ onMenuClick, onSearch }) => {
  const { logout } = useContext(AuthContext)
  const { user, isAuthenticated } = useSelector((state) => state.user)

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden p-2"
        >
          <ApperIcon name="Menu" className="h-6 w-6" />
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4 lg:mx-8">
          <SearchBar
            placeholder="Search patients, staff, or appointments..."
            onSearch={onSearch}
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="p-2 relative">
            <ApperIcon name="Bell" className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Emergency Button */}
          <Button variant="danger" size="sm" className="hidden sm:flex">
            <ApperIcon name="AlertTriangle" className="h-4 w-4 mr-2" />
            Emergency
          </Button>

          {/* Quick Actions */}
          <Button variant="primary" size="sm" className="hidden sm:flex">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Quick Add
          </Button>

          {/* User Info and Logout */}
          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.emailAddress}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="flex items-center"
              >
                <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header