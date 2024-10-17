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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const lengthUnits = [
  "millimeter",
  "centimeter",
  "meter",
  "kilometer",
  "inch",
  "foot",
  "yard",
  "mile",
];
const weightUnits = ["milligram", "gram", "kilogram", "ounce", "pound"];
const temperatureUnits = ["Celsius", "Fahrenheit", "Kelvin"];

const conversionFactors = {
  length: {
    millimeter: 1,
    centimeter: 10,
    meter: 1000,
    kilometer: 1000000,
    inch: 25.4,
    foot: 304.8,
    yard: 914.4,
    mile: 1609344,
  },
  weight: {
    milligram: 1,
    gram: 1000,
    kilogram: 1000000,
    ounce: 28349.5,
    pound: 453592,
  },
};

function convertTemperature(value: number, from: string, to: string) {
  if (from === to) return value;
  if (from === "Celsius") {
    if (to === "Fahrenheit") return (value * 9) / 5 + 32;
    if (to === "Kelvin") return value + 273.15;
  }
  if (from === "Fahrenheit") {
    if (to === "Celsius") return ((value - 32) * 5) / 9;
    if (to === "Kelvin") return ((value - 32) * 5) / 9 + 273.15;
  }
  if (from === "Kelvin") {
    if (to === "Celsius") return value - 273.15;
    if (to === "Fahrenheit") return ((value - 273.15) * 9) / 5 + 32;
  }
  return value;
}

function convertUnit(
  value: number,
  from: string,
  to: string,
  unitType: "length" | "weight"
) {
  const fromFactor = conversionFactors[unitType][from];
  const toFactor = conversionFactors[unitType][to];
  return (value * fromFactor) / toFactor;
}

export default function App() {
  const [tab, setTab] = useState("length");
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [result, setResult] = useState("");

  const handleConvert = () => {
    if (!value || !fromUnit || !toUnit) {
      alert("Please fill all fields");
      return;
    }

    const numValue = parseFloat(value);
    if (tab === "length" || tab === "weight" ? numValue <= 0 : false) {
      alert(`Value for ${tab} must be non-negative.`);
      return;
    }
    if (tab === "temperature") {
      switch (fromUnit) {
        case "Celsius":
          if (numValue < -273.15) {
            alert("Temperature cannot be less than -273.15 °C.");
            return;
          }
          break;
        case "Fahrenheit":
          if (numValue < -459.67) {
            alert("Temperature cannot be less than -459.67 °F.");
            return;
          }
          break;
        case "Kelvin":
          if (numValue < 0) {
            alert("Temperature cannot be less than 0 K.");
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
        tab as "length" | "weight"
      );
    }

    setResult(
      `${numValue} ${fromUnit} = ${convertedValue.toFixed(4)} ${toUnit}`
    );
  };

  const handleTabChange = (tab: string) => {
    setTab(tab);
    setFromUnit("");
    setToUnit("");
    setValue("");
    setResult("");
  };

  const unitOptions =
    tab === "length"
      ? lengthUnits
      : tab === "weight"
      ? weightUnits
      : temperatureUnits;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Unit Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="length">Length</TabsTrigger>
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
            </TabsList>
            <TabsContent value="length">
              <p className="text-sm text-muted-foreground mb-4">
                Convert between millimeter, centimeter, meter, kilometer, inch,
                foot, yard, and mile.
              </p>
            </TabsContent>
            <TabsContent value="weight">
              <p className="text-sm text-muted-foreground mb-4">
                Convert between milligram, gram, kilogram, ounce, and pound.
              </p>
            </TabsContent>
            <TabsContent value="temperature">
              <p className="text-sm text-muted-foreground mb-4">
                Convert between Celsius, Fahrenheit, and Kelvin.
              </p>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input
                id="value"
                type="number"
                min={0}
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
            © {new Date().getFullYear()} Qunzhe Zhu. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
