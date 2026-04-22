import { Shield, Users, Award, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Active Users",
  },
  {
    icon: Award,
    value: "50,000+",
    label: "Designs Created",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Secure & Private",
  },
  {
    icon: Clock,
    value: "< 3s",
    label: "Avg. Generation Time",
  },
];

export function TrustIndicators() {
  return (
    <section className="border-y border-white/10 bg-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <stat.icon className="h-8 w-8 text-brand-400 mb-3" />
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
