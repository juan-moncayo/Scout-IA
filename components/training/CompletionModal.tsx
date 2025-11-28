"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Award, TrendingUp } from "lucide-react"

interface CompletionModalProps {
  isOpen: boolean
  onClose: () => void
  moduleName: string
  phaseNumber: number
}

export function CompletionModal({ isOpen, onClose, moduleName, phaseNumber }: CompletionModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            Module Completed!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            You have successfully completed <span className="font-semibold text-gray-900">{moduleName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Phase {phaseNumber} Progress Updated
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Keep going to unlock the next phase
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Your progress has been saved automatically
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Continue Training
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}