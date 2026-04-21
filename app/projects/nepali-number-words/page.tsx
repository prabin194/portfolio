"use client";

import { useState, useMemo, useEffect } from "react";
import {
  toNepaliWords,
  toNepaliAmount,
  toNepaliDigits,
  toNepaliText,
  formatNepaliCurrency,
  nepaliWordsToNumber,
} from "nepali-number-words";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NepaliNumberWordsDemo() {
  const [numberInput, setNumberInput] = useState("4750");
  const [amountInput, setAmountInput] = useState("4750.50");
  const [digitsInput, setDigitsInput] = useState("Rs. 4750.00");
  const [textInput, setTextInput] = useState("Pay 4750 now");
  const [currencyInput, setCurrencyInput] = useState("4750");
  const [wordsToNumberInput, setWordsToNumberInput] = useState("चार हजार सात सय पचास");

  const [wordsToNumberError, setWordsToNumberError] = useState<string | null>(null);

  const wordsToNumberResult = useMemo(() => {
    try {
      return nepaliWordsToNumber(wordsToNumberInput);
    } catch (error) {
      return null;
    }
  }, [wordsToNumberInput]);

  useEffect(() => {
    try {
      nepaliWordsToNumber(wordsToNumberInput);
      setWordsToNumberError(null);
    } catch (error) {
      setWordsToNumberError(error instanceof Error ? error.message : "Invalid input");
    }
  }, [wordsToNumberInput]);

  const safeNumber = (value: string) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Nepali Number Words Demo</h1>
        <p className="text-muted-foreground">
          Interactive demo for the nepali-number-words library
        </p>
        <Badge variant="secondary" className="bg-emerald-950 text-primary">
          v1.1.1
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Number to Words */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Number to Nepali Words</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="number"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter a number"
            />
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium text-primary">
                {toNepaliWords(safeNumber(numberInput))}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Amount to Words */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Amount to Nepali Words</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="number"
              step="0.01"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter an amount"
            />
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium text-primary">
                {toNepaliAmount(safeNumber(amountInput))}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Nepali Digits */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Convert to Nepali Digits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              value={digitsInput}
              onChange={(e) => setDigitsInput(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter text with digits"
              maxLength={2000}
            />
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium text-primary">
                {toNepaliDigits(digitsInput)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Text Transformation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Replace Numbers with Words</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter text with numbers"
              maxLength={2000}
            />
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium text-primary">
                {toNepaliText(textInput)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Currency Formatting */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Format Nepali Currency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="number"
              value={currencyInput}
              onChange={(e) => setCurrencyInput(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter amount"
            />
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium text-primary">
                {formatNepaliCurrency(safeNumber(currencyInput))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                With Devanagari: {formatNepaliCurrency(safeNumber(currencyInput), { devanagari: true })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Words to Number */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Nepali Words to Number</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              value={wordsToNumberInput}
              onChange={(e) => {
                setWordsToNumberInput(e.target.value);
                setWordsToNumberError(null);
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter Nepali words"
            />
            <div className="p-3 bg-muted rounded-md">
              {wordsToNumberError ? (
                <p className="text-sm font-medium text-destructive">
                  {wordsToNumberError}
                </p>
              ) : wordsToNumberResult !== null ? (
                <p className="text-sm font-medium text-primary">
                  {wordsToNumberResult}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Enter Nepali words to convert</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          <strong>Note:</strong> Input fields are limited to 2000 characters for performance.
        </p>
        <p>
          <strong>Experimental:</strong> The Words to Number feature throws errors for invalid input.
        </p>
      </div>
    </div>
  );
}
