"use client";

import { useState } from "react";
import { NepaliDatePicker, defaultAdapter, type BsDate } from "bos-nepali-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BosNepaliDateDemo() {
  const [value, setValue] = useState<BsDate | null>(null);
  const [lang, setLang] = useState<"en" | "ne">("ne");
  const [disableToday, setDisableToday] = useState(false);
  const [showMonth, setShowMonth] = useState(true);
  const [showYear, setShowYear] = useState(true);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">BOS Nepali Date Demo</h1>
        <p className="text-muted-foreground">
          Interactive demo for the bos-nepali-date React component
        </p>
        <Badge variant="secondary" className="bg-emerald-950 text-primary">
          v0.1.7
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {/* Main Date Picker */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Nepali Date Picker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <NepaliDatePicker
                value={value}
                onChange={setValue}
                adapter={defaultAdapter}
                lang={lang}
                disableToday={disableToday}
                showMonth={showMonth}
                showYear={showYear}
                inputClassName="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium text-primary">
                Selected: {value ? JSON.stringify(value) : "No date selected"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button
                variant={lang === "ne" ? "default" : "outline"}
                onClick={() => setLang("ne")}
                size="sm"
              >
                Nepali (नेपाली)
              </Button>
              <Button
                variant={lang === "en" ? "default" : "outline"}
                onClick={() => setLang("en")}
                size="sm"
              >
                English
              </Button>
              <Button
                variant={disableToday ? "default" : "outline"}
                onClick={() => setDisableToday(!disableToday)}
                size="sm"
              >
                {disableToday ? "Disable Today: ON" : "Disable Today: OFF"}
              </Button>
              <Button
                variant={showMonth ? "default" : "outline"}
                onClick={() => setShowMonth(!showMonth)}
                size="sm"
              >
                {showMonth ? "Show Month: ON" : "Show Month: OFF"}
              </Button>
              <Button
                variant={showYear ? "default" : "outline"}
                onClick={() => setShowYear(!showYear)}
                size="sm"
              >
                {showYear ? "Show Year: ON" : "Show Year: OFF"}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setValue(null)}
              size="sm"
              className="w-full"
            >
              Clear Selection
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Full BS dataset (2000–2099) with pluggable adapter</p>
            <p>• Localized UI (English + Nepali) with ASCII output</p>
            <p>• Robust input mask (normalizes Nepali/Arabic digits)</p>
            <p>• Disable & range constraints (disableToday, minDate, maxDate)</p>
            <p>• Picker controls (showMonth, showYear, optional label)</p>
            <p>• Polished UX & accessibility (focus trapping, aria attributes)</p>
            <p>• CSS that auto-injects (no Tailwind required)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
