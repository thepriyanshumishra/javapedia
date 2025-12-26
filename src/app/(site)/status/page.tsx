"use client";

import { ANIMATION_VARIANTS } from "@/components/home/animation-variants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  CheckCircle,
  Clock,
  Database,
  Globe,
  Server,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function StatusPage() {
  const systems = [
    {
      name: "Website",
      status: "operational",
      uptime: "100%",
      icon: <Globe className="h-5 w-5 text-blue-500" />,
      description: "Main website and documentation portal",
    },
    {
      name: "API Services",
      status: "operational",
      uptime: "99.99%",
      icon: <Server className="h-5 w-5 text-purple-500" />,
      description: "Backend API and data services",
    },
    {
      name: "Database",
      status: "operational",
      uptime: "100%",
      icon: <Database className="h-5 w-5 text-green-500" />,
      description: "Primary database cluster",
    },
    {
      name: "CDN",
      status: "operational",
      uptime: "100%",
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      description: "Global content delivery network",
    },
    {
      name: "Authentication",
      status: "operational",
      uptime: "100%",
      icon: <Shield className="h-5 w-5 text-red-500" />,
      description: "User authentication and security",
    },
  ];

  const incidents = [
    {
      date: "October 15, 2025",
      title: "Scheduled Maintenance",
      status: "completed",
      description:
        "Routine database maintenance and security updates were completed successfully.",
    },
    // Add more incidents as needed
  ];

  return (
    <div className="bg-background min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={ANIMATION_VARIANTS.container}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div
            variants={ANIMATION_VARIANTS.item}
            className="text-center"
          >
            <h1 className="font-funnel-display text-4xl font-bold tracking-tight sm:text-5xl">
              System Status
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              Real-time performance and availability monitoring
            </p>
          </motion.div>

          {/* Overall Status */}
          <motion.div variants={ANIMATION_VARIANTS.item}>
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
                      All Systems Operational
                    </h2>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80">
                      Last updated: Just now
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <Badge
                    variant="outline"
                    className="border-green-500/30 text-green-700 dark:text-green-300"
                  >
                    <Activity className="mr-2 h-3 w-3" />
                    Monitoring
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Grid */}
          <motion.div
            variants={ANIMATION_VARIANTS.container}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {systems.map((system, index) => (
              <motion.div key={index} variants={ANIMATION_VARIANTS.item}>
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {system.name}
                    </CardTitle>
                    {system.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        <span className="text-sm font-medium text-green-600 capitalize dark:text-green-400">
                          {system.status}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {system.uptime} uptime
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-3 text-xs">
                      {system.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Incident History */}
          <motion.div variants={ANIMATION_VARIANTS.item} className="space-y-6">
            <h3 className="font-funnel-display text-2xl font-semibold">
              Past Incidents
            </h3>
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{incident.title}</h4>
                          <Badge variant="secondary" className="capitalize">
                            {incident.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {incident.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Clock className="h-4 w-4" />
                        {incident.date}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Footer Link */}
          <motion.div
            variants={ANIMATION_VARIANTS.item}
            className="flex justify-center pt-8"
          >
            <Link href="/">
              <Button variant="ghost">← Back to Home</Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
