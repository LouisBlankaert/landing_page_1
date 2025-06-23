import { cn } from "@/lib/utils";

interface TodoListProps {
  items: string[];
  className?: string;
}

export function TodoList({ items, className }: TodoListProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-md p-6", className)}>
      <h2 className="text-xl font-bold mb-4">Ta To Do List:</h2>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-green-500"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <span className="text-gray-800">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
