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
import { ArrowUpDown } from "lucide-react";

const lengthUnits = [
  { name: "Kilometer", symbol: "km" },
  { name: "Meter", symbol: "m" },
  { name: "Centimeter", symbol: "cm" },
  { name: "Millimeter", symbol: "mm" },
  { name: "Micrometer", symbol: "μm" },
  { name: "Nanometer", symbol: "nm" },
  { name: "Mile", symbol: "mi" },
  { name: "Yard", symbol: "yd" },
  { name: "Foot", symbol: "ft" },
  { name: "Inch", symbol: "in" },
  { name: "Nautical mile", symbol: "nmi" },
];
const weightUnits = [
  { name: "Ton", symbol: "t" },
  { name: "Kilogram", symbol: "kg" },
  { name: "Gram", symbol: "g" },
  { name: "Milligram", symbol: "mg" },
  { name: "Microgram", symbol: "μg" },
  { name: "Pound", symbol: "lb" },
  { name: "Ounce", symbol: "oz" },
];
const temperatureUnits = [
  { name: "Fahrenheit", symbol: "°F" },
  { name: "Celsius", symbol: "°C" },
  { name: "Kelvin", symbol: "K" },
];
const volumeUnits = [
  { name: "Gallon", symbol: "gal" },
  { name: "Quart", symbol: "qt" },
  { name: "Pint", symbol: "pt" },
  { name: "Cup", symbol: "cup" },
  { name: "Fluid ounce", symbol: "fl oz" },
  { name: "Tablespoon", symbol: "tbsp" },
  { name: "Teaspoon", symbol: "tsp" },
  { name: "Liter", symbol: "L" },
  { name: "Milliliter", symbol: "mL" },
];
const areaUnits = [
  { name: "Square kilometer", symbol: "km²" },
  { name: "Square meter", symbol: "m²" },
  { name: "Square mile", symbol: "mi²" },
  { name: "Square yard", symbol: "yd²" },
  { name: "Square foot", symbol: "ft²" },
  { name: "Square inch", symbol: "in²" },
  { name: "Hectare", symbol: "ha" },
  { name: "Acre", symbol: "ac" },
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
  weight: {
    Ton: 1000000,
    Kilogram: 1000,
    Gram: 1,
    Milligram: 0.001,
    Microgram: 0.000001,
    Pound: 453.59237,
    Ounce: 453.59237 / 16.0,
  },
  volume: {
    Gallon: 3.785411784,
    Quart: 3.785411784 / 4.0,
    Pint: 3.785411784 / 8.0,
    Cup: 3.785411784 / 16.0,
    "Fluid ounce": 3.785411784 / 128.0,
    Tablespoon: 3.785411784 / 256.0,
    Teaspoon: 3.785411784 / 768.0,
    Liter: 1,
    Milliliter: 0.001,
  },
  area: {
    "Square kilometer": 1000000,
    "Square meter": 1,
    "Square mile": 2589988.11,
    "Square yard": 0.836127,
    "Square foot": 0.092903,
    "Square inch": 0.00064516,
    Hectare: 10000,
    Acre: 4046.8564224,
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
  unitType: "length" | "weight" | "volume" | "area"
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
    if (["length", "weight", "volume", "area"].includes(tab) && numValue < 0) {
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
        tab as "length" | "weight" | "volume" | "area"
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

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult("");
  };

  const unitOptions =
    tab === "length"
      ? lengthUnits
      : tab === "weight"
      ? weightUnits
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
              <TabsTrigger value="weight" className="tab-name">
                Weight
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
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name}({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="to" className="text-right">
                To
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions
                      .filter((unit) => unit.name !== fromUnit)
                      .map((unit) => (
                        <SelectItem key={unit.name} value={unit.name}>
                          {unit.name}({unit.symbol})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <button
                  onClick={handleSwap}
                  className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                  aria-label="Swap units"
                >
                  <ArrowUpDown size={20} />
                </button>
              </div>
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
