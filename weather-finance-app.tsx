"use client"

import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ArrowDown, ArrowUp, Calendar, Clock, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data representing temperature and humidity as if they were stock prices
const data = [
  { time: "9:00", temperature: 18.2, humidity: 65 },
  { time: "10:00", temperature: 19.5, humidity: 62 },
  { time: "11:00", temperature: 21.3, humidity: 58 },
  { time: "12:00", temperature: 22.8, humidity: 55 },
  { time: "13:00", temperature: 23.5, humidity: 52 },
  { time: "14:00", temperature: 24.1, humidity: 50 },
  { time: "15:00", temperature: 23.8, humidity: 51 },
  { time: "16:00", temperature: 22.5, humidity: 54 },
  { time: "17:00", temperature: 21.0, humidity: 58 },
]

const weekData = [
  { day: "月", temperature: 19.5, humidity: 62 },
  { day: "火", temperature: 20.8, humidity: 58 },
  { day: "水", temperature: 22.3, humidity: 55 },
  { day: "木", temperature: 21.5, humidity: 60 },
  { day: "金", temperature: 23.2, humidity: 52 },
  { day: "土", temperature: 24.5, humidity: 48 },
  { day: "日", temperature: 22.8, humidity: 53 },
]

const monthData = [
  { week: "第1週", temperature: 21.2, humidity: 58 },
  { week: "第2週", temperature: 22.5, humidity: 55 },
  { week: "第3週", temperature: 24.1, humidity: 50 },
  { week: "第4週", temperature: 23.0, humidity: 52 },
]

export default function WeatherFinanceApp() {
  const [timeframe, setTimeframe] = useState("day")

  // Calculate metrics like financial indicators
  const currentTemp = data[data.length - 1].temperature
  const previousTemp = data[data.length - 2].temperature
  const tempChange = currentTemp - previousTemp
  const tempChangePercent = ((tempChange / previousTemp) * 100).toFixed(2)

  const currentHumidity = data[data.length - 1].humidity
  const previousHumidity = data[data.length - 2].humidity
  const humidityChange = currentHumidity - previousHumidity
  const humidityChangePercent = ((humidityChange / previousHumidity) * 100).toFixed(2)

  // Select data based on timeframe
  const getChartData = () => {
    switch (timeframe) {
      case "day":
        return data
      case "week":
        return weekData
      case "month":
        return monthData
      default:
        return data
    }
  }

  // Get the appropriate x-axis key based on timeframe
  const getXAxisKey = () => {
    switch (timeframe) {
      case "day":
        return "time"
      case "week":
        return "day"
      case "month":
        return "week"
      default:
        return "time"
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">気象インデックス投資</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            2023年10月15日
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>気温指数 (TMP)</CardTitle>
                <CardDescription>日中の気温変動</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{currentTemp}°C</div>
                <div className={`flex items-center ${tempChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {tempChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  {Math.abs(tempChange).toFixed(1)}°C ({tempChangePercent}%)
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  temperature: {
                    label: "気温",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey={getXAxisKey()} tickLine={false} axisLine={false} />
                  <YAxis
                    domain={["dataMin - 1", "dataMax + 1"]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}°C`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#temperatureGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="grid grid-cols-3 w-full text-center text-sm">
              <div>
                <div className="font-medium">日中高値</div>
                <div>24.1°C</div>
              </div>
              <div>
                <div className="font-medium">日中安値</div>
                <div>18.2°C</div>
              </div>
              <div>
                <div className="font-medium">変動幅</div>
                <div>5.9°C</div>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>湿度指数 (HMD)</CardTitle>
                <CardDescription>日中の湿度変動</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{currentHumidity}%</div>
                <div className={`flex items-center ${humidityChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {humidityChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  {Math.abs(humidityChange)}% ({humidityChangePercent}%)
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  humidity: {
                    label: "湿度",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey={getXAxisKey()} tickLine={false} axisLine={false} />
                  <YAxis
                    domain={["dataMin - 5", "dataMax + 5"]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#humidityGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="grid grid-cols-3 w-full text-center text-sm">
              <div>
                <div className="font-medium">日中高値</div>
                <div>65%</div>
              </div>
              <div>
                <div className="font-medium">日中安値</div>
                <div>50%</div>
              </div>
              <div>
                <div className="font-medium">変動幅</div>
                <div>15%</div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>気象指数ポートフォリオ</CardTitle>
            <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="day">日</TabsTrigger>
                <TabsTrigger value="week">週</TabsTrigger>
                <TabsTrigger value="month">月</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                temperature: {
                  label: "気温",
                  color: "hsl(var(--chart-1))",
                },
                humidity: {
                  label: "湿度",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={getXAxisKey()} tickLine={false} axisLine={false} />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}°C`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">気温・湿度相関指数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">-0.97</div>
            <div className="h-[100px]">
              <ChartContainer
                config={{
                  correlation: {
                    label: "相関",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <BarChart
                  data={[
                    { name: "9時", correlation: -0.92 },
                    { name: "12時", correlation: -0.95 },
                    { name: "15時", correlation: -0.97 },
                    { name: "18時", correlation: -0.94 },
                  ]}
                >
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis hide domain={[-1, 0]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="correlation" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">気温変動率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500 mb-2">+32.4%</div>
            <div className="text-sm text-muted-foreground mb-2">前日比</div>
            <div className="h-[100px]">
              <ChartContainer
                config={{
                  volatility: {
                    label: "変動率",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <BarChart
                  data={[
                    { name: "月", volatility: 18 },
                    { name: "火", volatility: 22 },
                    { name: "水", volatility: 25 },
                    { name: "木", volatility: 30 },
                    { name: "金", volatility: 32.4 },
                  ]}
                >
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="volatility" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">湿度変動率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500 mb-2">-23.1%</div>
            <div className="text-sm text-muted-foreground mb-2">前日比</div>
            <div className="h-[100px]">
              <ChartContainer
                config={{
                  volatility: {
                    label: "変動率",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <BarChart
                  data={[
                    { name: "月", volatility: -15 },
                    { name: "火", volatility: -18 },
                    { name: "水", volatility: -20 },
                    { name: "木", volatility: -21 },
                    { name: "金", volatility: -23.1 },
                  ]}
                >
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis hide domain={[-30, 0]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="volatility" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 text-xs text-muted-foreground flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        最終更新: 2023年10月15日 17:30
      </div>
    </div>
  )
}

