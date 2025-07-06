import { cn } from '@/lib/utils'
import { CustomComponentProps } from '../interfaces'

const Container = ({ children, className }: CustomComponentProps) => {
  return (
    <div className={cn('px-4 sm:px-6 lg:px-10 max-w-full mx-auto', className)}>
      {children}
    </div>
  )
}

export default Container
