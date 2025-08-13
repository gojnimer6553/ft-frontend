import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Plus, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/__authenticatedLayout/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="border-border hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Calendar className="w-12 h-12 text-primary mx-auto mb-2" />
            <CardTitle className="text-primary">Daily Tracking</CardTitle>
            <CardDescription>
              Log your meals and snacks throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">View Diary</Button>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Plus className="w-12 h-12 text-primary mx-auto mb-2" />
            <CardTitle className="text-primary">Add Meals</CardTitle>
            <CardDescription>
              Quickly log breakfast, lunch, dinner, and snacks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full ">Add Meal</Button>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
            <CardTitle className="text-primary">Progress</CardTitle>
            <CardDescription>
              Monitor your nutrition trends and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary-foreground bg-transparent"
            >
              View Progress
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="text-center mt-12 [view-transition-name:match-element]">
        <p className="text-muted-foreground mb-6">
          Ready to start tracking your meals?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Log Your First Meal
          </Button>
          <Button variant="outline" size="lg">
            <Calendar className="w-5 h-5 mr-2" />
            View Food Diary
          </Button>
        </div>
      </div>
    </div>
  );
}
