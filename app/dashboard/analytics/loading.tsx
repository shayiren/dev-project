export default function Loading() {
  return (
    <div className="p-8 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-medium mb-2">Loading analytics data...</h2>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}
