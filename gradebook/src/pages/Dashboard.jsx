import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import sql from '../lib/db';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const data = await sql`
            SELECT 
                c.id, 
                c.name, 
                c.color, 
                COALESCE(
                    ROUND(
                        (SUM(g.score) * 100.0) / NULLIF(SUM(a.max_points), 0)
                    ), 
                    0
                ) as class_average
            FROM classes c
            LEFT JOIN modules m ON m.class_id = c.id
            LEFT JOIN assignments a ON a.module_id = m.id
            LEFT JOIN grades g ON g.assignment_id = a.id
            GROUP BY c.id
            ORDER BY c.name ASC
        `;
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  const getBadgeColor = (avg) => {
    if (avg >= 90) return "bg-green-600";
    if (avg >= 80) return "bg-blue-600";
    if (avg >= 70) return "bg-yellow-600";
    if (avg > 0) return "bg-red-600";
    return "bg-zinc-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Dashboard
        </h2>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[150px] w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="p-8 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400">
            No classes found.
        </div>
      ) : (
        <>
          {/* --- MOBILE VIEW --- */}
          {/* Visible on small screens, hidden on desktop (md:) */}
          <div className="flex flex-col gap-4 md:hidden">
            {classes.map((c) => (
              <Link to={`/class/${c.id}`} key={c.id} className="block active:scale-[0.98] transition-transform">
                <div className="flex items-center justify-between p-6 min-h-[110px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="w-2 h-12 rounded-full" style={{ backgroundColor: c.color }} />
                    <div>
                      <h3 className="font-bold text-xl leading-none mb-1 text-zinc-900 dark:text-white">{c.name}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">4th Grade</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getBadgeColor(c.class_average)} text-white border-0 px-3 py-1 text-sm`}>
                        {c.class_average > 0 ? `${c.class_average}%` : '-'}
                    </Badge>
                    <ChevronRight className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* --- DESKTOP VIEW --- */}
          {/* Hidden on mobile, visible on desktop (md:grid) */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {classes.map((c) => (
              <Link to={`/class/${c.id}`} key={c.id} className="block group hover:-translate-y-1 transition-transform duration-200">
                <div 
                  className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:shadow-xl transition-all relative"
                >
                    {/* Left Color Border Strip */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: c.color }} />
                    
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="pl-2">
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{c.name}</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">4th Grade</p>
                            </div>
                            <Badge className={`${getBadgeColor(c.class_average)} text-white border-0 text-base px-3 py-1`}>
                                {c.class_average > 0 ? `${c.class_average}%` : 'N/A'}
                            </Badge>
                        </div>
                        
                        <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-base font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-500 transition-colors pl-2">
                            <span>View Gradebook</span>
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}