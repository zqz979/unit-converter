import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const lengthUnits = [
  "Kilometer",
  "Meter",
  "Centimeter",
  "Millimeter",
  "Micrometer",
  "Nanometer",
  "Mile",
  "Yard",
  "Foot",
  "Inch",
  "Nautical mile",
];
const massUnits = [
  "Metric ton",
  "Kilogram",
  "Gram",
  "Milligram",
  "Microgram",
  "Imperial ton",
  "US ton",
  "Stone",
  "Pound",
  "Ounce",
];
const temperatureUnits = ["Fahrenheit", "Celsius", "Kelvin"];
const volumeUnits = [
  "US liquid gallon",
  "US liquid quart",
  "US liquid pint",
  "US legal cup",
  "US fluid ounce",
  "US tablespoon",
  "US teaspoon",
  "Cubic meter",
  "Liter",
  "Milliliter",
  "Imperial gallon",
  "Imperial quart",
  "Imperial pint",
  "Imperial cup",
  "Imperial fluid ounce",
  "Imperial tablespoon",
  "Imperial teaspoon",
  "Cubic foot",
  "Cubic inch",
];
const areaUnits = [
  "Square kilometer",
  "Square meter",
  "Square mile",
  "Square yard",
  "Square foot",
  "Square inch",
  "Hectare",
  "Acre",
];

const conversionFactors = {
  length: {
    Kilometer: 1000,
    Meter: 1,
    Centimeter: 0.01,
    Millimeter: 0.001,
    Micrometer: 0.000001,
    Nanometer: 0.000000001,
    Mile: 1609.344,
    Yard: 0.9144,
    Foot: 0.3048,
    Inch: 0.0254,
    "Nautical mile": 1852,
  },
  mass: {
    "Metric ton": 1000000,
    Kilogram: 1000,
    Gram: 1,
    Milligram: 0.001,
    Microgram: 0.000001,
    "Imperial ton": 1016046.9088,
    "US ton": 907184.74,
    Stone: 6350.29318,
    Pound: 453.59237,
    Ounce: 28.34952,
  },
  volume: {
    "US liquid gallon": 3.78541,
    "US liquid quart": 0.946353,
    "US liquid pint": 0.473176,
    "US legal cup": 0.24,
    "US fluid ounce": 0.0295735,
    "US tablespoon": 0.0147868,
    "US teaspoon": 0.00492892,
    "Cubic meter": 1000,
    Liter: 1,
    Milliliter: 0.001,
    "Imperial gallon": 4.54609,
    "Imperial quart": 1.13652,
    "Imperial pint": 0.568261,
    "Imperial cup": 0.284131,
    "Imperial fluid ounce": 0.0284131,
    "Imperial tablespoon": 0.0177582,
    "Imperial teaspoon": 0.00591939,
    "Cubic foot": 28.3168,
    "Cubic inch": 0.0163871,
  },
  area: {
    "Square kilometer": 1000000,
    "Square meter": 1,
    "Square mile": 2589988.11,
    "Square yard": 0.836127,
    "Square foot": 0.092903,
    "Square inch": 0.00064516,
    Hectare: 10000,
    Acre: 4046.86,
  },
};

function convertTemperature(value: number, from: string, to: string) {
  if (from === to) return value;
  if (from === "Fahrenheit") {
    if (to === "Celsius") return ((value - 32) * 5) / 9;
    if (to === "Kelvin") return ((value - 32) * 5) / 9 + 273.15;
  }
  if (from === "Celsius") {
    if (to === "Fahrenheit") return (value * 9) / 5 + 32;
    if (to === "Kelvin") return value + 273.15;
  }
  if (from === "Kelvin") {
    if (to === "Fahrenheit") return ((value - 273.15) * 9) / 5 + 32;
    if (to === "Celsius") return value - 273.15;
  }
  return value;
}

function convertUnit(
  value: number,
  from: string,
  to: string,
  unitType: "length" | "mass" | "volume" | "area"
) {
  const factors = conversionFactors[unitType];
  const fromFactor = factors[from as keyof typeof factors];
  const toFactor = factors[to as keyof typeof factors];
  return (value * fromFactor) / toFactor;
}

export default function Component() {
  const [tab, setTab] = useState("length");
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [result, setResult] = useState("");

  const handleConvert = () => {
    if (!value || !fromUnit || !toUnit) {
      alert("Please fill all fields.");
      return;
    }

    const numValue = parseFloat(value);
    if (["length", "mass", "volume", "area"].includes(tab) && numValue < 0) {
      alert(`Value for ${tab} must be non-negative.`);
      return;
    }
    if (tab === "temperature") {
      switch (fromUnit) {
        case "Fahrenheit":
          if (numValue < -459.67) {
            alert(
              "Temperature cannot be less than -459.67 °F (absolute zero)."
            );
            return;
          }
          break;
        case "Celsius":
          if (numValue < -273.15) {
            alert(
              "Temperature cannot be less than -273.15 °C (absolute zero)."
            );
            return;
          }
          break;
        case "Kelvin":
          if (numValue < 0) {
            alert("Temperature cannot be less than 0 K (absolute zero).");
            return;
          }
          break;
      }
    }

    if (isNaN(numValue)) {
      alert("Please enter a valid number");
      return;
    }

    let convertedValue: number;
    if (tab === "temperature") {
      convertedValue = convertTemperature(numValue, fromUnit, toUnit);
    } else {
      convertedValue = convertUnit(
        numValue,
        fromUnit,
        toUnit,
        tab as "length" | "mass" | "volume" | "area"
      );
    }

    setResult(
      `${numValue} ${fromUnit} = ${convertedValue.toFixed(6)} ${toUnit}`
    );
  };

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setFromUnit("");
    setToUnit("");
    setValue("");
    setResult("");
  };

  const unitOptions =
    tab === "length"
      ? lengthUnits
      : tab === "mass"
      ? massUnits
      : tab === "volume"
      ? volumeUnits
      : tab === "area"
      ? areaUnits
      : temperatureUnits;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Unit Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5 gap-0.5">
              <TabsTrigger value="length" className="tab-name">
                Length
              </TabsTrigger>
              <TabsTrigger value="mass" className="tab-name">
                Mass
              </TabsTrigger>
              <TabsTrigger value="temperature" className="tab-name">
                Temperature
              </TabsTrigger>
              <TabsTrigger value="volume" className="tab-name">
                Volume
              </TabsTrigger>
              <TabsTrigger value="area" className="tab-name">
                Area
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input
                id="value"
                type="number"
                min={tab !== "temperature" ? 0 : undefined}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="from" className="text-right">
                From
              </Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="to" className="text-right">
                To
              </Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={handleConvert}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Convert
            </button>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Result:</h3>
              <p>{result}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Unit Converter. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
