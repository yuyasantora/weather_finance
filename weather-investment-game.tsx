"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Cloud,
  Sun,
  MapPin,
  Briefcase,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 初期データ
const initialData = [
  { time: "9:00", temperature: 18.2, humidity: 65 },
  { time: "10:00", temperature: 19.5, humidity: 62 },
  { time: "11:00", temperature: 21.3, humidity: 58 },
  { time: "12:00", temperature: 22.8, humidity: 55 },
]

// 予測可能な次のデータポイント
const nextPossibleData = [
  { time: "13:00", temperature: 23.5, humidity: 52 },
  { time: "14:00", temperature: 24.1, humidity: 50 },
  { time: "15:00", temperature: 23.8, humidity: 51 },
  { time: "16:00", temperature: 22.5, humidity: 54 },
  { time: "17:00", temperature: 21.0, humidity: 58 },
]

// 日本の地方リストと天気特性
const regions = [
  {
    name: "北海道",
    characteristics:
      "寒冷な気候で四季がはっきりしています。冬は長く厳しい寒さと豪雪、夏は比較的涼しく過ごしやすいのが特徴です。",
  },
  {
    name: "東北",
    characteristics:
      "冬は日本海側を中心に豪雪地帯となり、太平洋側は晴れの日が多いです。夏は比較的涼しく、「やませ」と呼ばれる冷たい東風の影響を受けることがあります。",
  },
  {
    name: "関東",
    characteristics:
      "夏は高温多湿で蒸し暑く、冬は乾燥して晴れの日が多いです。「空っ風」と呼ばれる乾いた強い北西風が特徴的です。",
  },
  {
    name: "中部",
    characteristics:
      "日本海側と太平洋側で気候が大きく異なります。日本海側は冬に雪が多く、太平洋側は比較的温暖です。中央高地は標高が高く冷涼な気候です。",
  },
  {
    name: "近畿",
    characteristics:
      "瀬戸内海側は温暖で雨が少なく、日本海側は冬に雪が多いです。夏は高温多湿で、「フェーン現象」による猛暑日が発生することがあります。",
  },
  {
    name: "中国",
    characteristics:
      "瀬戸内海側は温暖少雨で晴れの日が多く、日本海側は冬に雪が多いです。「やまじ風」と呼ばれる局地風が吹くことがあります。",
  },
  {
    name: "四国",
    characteristics: "太平洋側は温暖多雨で、瀬戸内海側は温暖少雨です。夏は高温多湿で、台風の影響を受けやすい地域です。",
  },
  {
    name: "九州・沖縄",
    characteristics:
      "九州北部は温暖で、南部は亜熱帯気候です。沖縄は年間を通して温暖で、台風の通過ルートになることが多いです。梅雨が長く、夏は高温多湿です。",
  },
]

// 職業リスト
const occupations = [
  "会社員",
  "公務員",
  "自営業",
  "フリーランス",
  "学生",
  "主婦/主夫",
  "パート/アルバイト",
  "経営者/役員",
  "専門職",
  "教育関係",
  "医療関係",
  "IT関係",
  "金融関係",
  "サービス業",
  "製造業",
  "農林水産業",
  "その他",
]

export default function WeatherInvestmentGame() {
  // ゲーム状態
  const [showTitleScreen, setShowTitleScreen] = useState(true) // タイトル画面表示フラグ
  const [showProfileScreen, setShowProfileScreen] = useState(false) // プロフィール設定画面表示フラグ
  const [difficulty, setDifficulty] = useState("normal") // 難易度設定
  const [region, setRegion] = useState("") // 選択した地方
  const [occupation, setOccupation] = useState("") // 選択した職業
  const [funds, setFunds] = useState(10000) // 初期資金
  const [day, setDay] = useState(1) // ゲーム日数
  const [data, setData] = useState(initialData) // 現在の気象データ
  const [tempShares, setTempShares] = useState(0) // 気温株の保有数
  const [humidShares, setHumidShares] = useState(0) // 湿度株の保有数
  const [tempPrice, setTempPrice] = useState(100) // 気温株の現在価格
  const [humidPrice, setHumidPrice] = useState(100) // 湿度株の現在価格
  const [tempValue, setTempValue] = useState(0) // 気温株の保有価値
  const [humidValue, setHumidValue] = useState(0) // 湿度株の保有価値
  const [gameOver, setGameOver] = useState(false) // ゲームオーバーフラグ
  const [showTutorial, setShowTutorial] = useState(false) // チュートリアル表示フラグ
  const [currentStep, setCurrentStep] = useState(0) // 現在のターン（時間）
  const [showBuyDialog, setShowBuyDialog] = useState(false) // 購入ダイアログ表示フラグ
  const [buyType, setBuyType] = useState("") // 購入する株の種類
  const [buyAmount, setBuyAmount] = useState(1) // 購入する株の数
  const [prediction, setPrediction] = useState("up") // 予測（上昇/下降）
  const [showPredictionDialog, setShowPredictionDialog] = useState(false) // 予測ダイアログ表示フラグ
  const [predictionType, setPredictionType] = useState("") // 予測する株の種類
  const [predictionAmount, setPredictionAmount] = useState(1000) // 予測に賭ける金額
  const [activePredictions, setActivePredictions] = useState([]) // アクティブな予測リスト
  const [showOptions, setShowOptions] = useState(false) // オプション画面表示フラグ
  const [selectedMenuItem, setSelectedMenuItem] = useState(0) // 選択中のメニュー項目
  const [bgmVolume, setBgmVolume] = useState(50) // BGM音量
  const [sfxVolume, setSfxVolume] = useState(50) // 効果音音量

  // 株価の計算（気温/湿度の変化に基づく）
  useEffect(() => {
    if (data.length > 1) {
      const lastTemp = data[data.length - 1].temperature
      const prevTemp = data[data.length - 2].temperature
      const tempChange = ((lastTemp - prevTemp) / prevTemp) * 10

      const lastHumid = data[data.length - 1].humidity
      const prevHumid = data[data.length - 2].humidity
      const humidChange = ((lastHumid - prevHumid) / prevHumid) * 10

      // 株価の更新（前回の価格に変化率を適用）
      setTempPrice((prev) => Math.max(1, Math.round(prev * (1 + tempChange / 100))))
      setHumidPrice((prev) => Math.max(1, Math.round(prev * (1 + humidChange / 100))))
    }
  }, [data])

  // 保有株の価値計算
  useEffect(() => {
    setTempValue(tempShares * tempPrice)
    setHumidValue(humidShares * humidPrice)

    // ゲームオーバー判定（資金が0かつ株も持っていない）
    if (funds <= 0 && tempValue <= 0 && humidValue <= 0) {
      setGameOver(true)
    }
  }, [funds, tempShares, humidShares, tempPrice, humidPrice, tempValue, humidValue])

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showTitleScreen) {
        // タイトル画面でのキー操作
        if (e.key === "ArrowUp") {
          setSelectedMenuItem((prev) => Math.max(0, prev - 1))
        } else if (e.key === "ArrowDown") {
          setSelectedMenuItem((prev) => Math.min(2, prev + 1))
        } else if (e.key === "Enter") {
          handleMenuSelect(selectedMenuItem)
        }
      } else if (showOptions) {
        // オプション画面でのキー操作
        if (e.key === "Escape") {
          setShowOptions(false)
          setShowTitleScreen(true)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showTitleScreen, selectedMenuItem, showOptions])

  // メニュー選択処理
  const handleMenuSelect = (index) => {
    switch (index) {
      case 0: // ニューゲーム
        setShowTitleScreen(false)
        setShowProfileScreen(true)
        break
      case 1: // コンティニュー
        // セーブデータがあれば読み込む処理（今回は省略）
        toast({
          title: "セーブデータがありません",
          description: "新しくゲームを始めてください。",
          variant: "destructive",
        })
        break
      case 2: // オプション
        setShowTitleScreen(false)
        setShowOptions(true)
        break
    }
  }

  // 次のターンに進む
  const advanceTurn = () => {
    // 調整されたデータを使用（存在する場合）
    const dataToUse = window.adjustedNextPossibleData || nextPossibleData

    if (currentStep >= dataToUse.length) {
      // 一日の終了、次の日へ
      setDay((prev) => prev + 1)
      setCurrentStep(0)

      // データをリセットして新しい日を始める
      // 初期データも調整されている場合はそれを使用
      const initialDataToUse = window.adjustedInitialData || initialData
      setData(initialDataToUse)

      // 予測の結果を処理
      processActivePredictions()

      return
    }

    // 次のデータポイントを追加
    const nextData = [...data, dataToUse[currentStep]]
    setData(nextData)
    setCurrentStep((prev) => prev + 1)

    // 予測の結果を処理
    processActivePredictions()
  }

  // 予測結果の処理
  const processActivePredictions = () => {
    const newPredictions = []

    activePredictions.forEach((pred) => {
      if (pred.expiresAt === currentStep + 1) {
        // 予測の判定時間
        const lastIndex = data.length - 1
        const currentValue = pred.type === "temperature" ? data[lastIndex].temperature : data[lastIndex].humidity

        const prevValue = pred.type === "temperature" ? data[lastIndex - 1].temperature : data[lastIndex - 1].humidity

        const isUp = currentValue > prevValue

        // 予測が当たったかどうか
        if ((pred.prediction === "up" && isUp) || (pred.prediction === "down" && !isUp)) {
          // 予測成功、報酬を得る
          setFunds((prev) => prev + pred.amount * 2)
          toast({
            title: "予測成功！",
            description: `${pred.amount * 2}ptの報酬を獲得しました！`,
            variant: "default",
          })
        } else {
          // 予測失敗
          toast({
            title: "予測失敗",
            description: `${pred.amount}ptを失いました。`,
            variant: "destructive",
          })
        }
      } else {
        // まだ有効な予測
        newPredictions.push(pred)
      }
    })

    setActivePredictions(newPredictions)
  }

  // 株の購入
  const buyShares = () => {
    const cost = buyType === "temperature" ? tempPrice * buyAmount : humidPrice * buyAmount

    if (cost > funds) {
      toast({
        title: "資金不足",
        description: "購入するための資金が足りません。",
        variant: "destructive",
      })
      return
    }

    if (buyType === "temperature") {
      setTempShares((prev) => prev + buyAmount)
    } else {
      setHumidShares((prev) => prev + buyAmount)
    }

    setFunds((prev) => prev - cost)
    setShowBuyDialog(false)

    toast({
      title: "購入完了",
      description: `${buyType === "temperature" ? "気温株" : "湿度株"} ${buyAmount}株を${cost}ptで購入しました。`,
    })
  }

  // 株の売却
  const sellShares = (type, amount) => {
    if (type === "temperature") {
      if (tempShares < amount) {
        toast({
          title: "株数不足",
          description: "売却する株数が保有数を超えています。",
          variant: "destructive",
        })
        return
      }

      const revenue = tempPrice * amount
      setTempShares((prev) => prev - amount)
      setFunds((prev) => prev + revenue)

      toast({
        title: "売却完了",
        description: `気温株 ${amount}株を${revenue}ptで売却しました。`,
      })
    } else {
      if (humidShares < amount) {
        toast({
          title: "株数不足",
          description: "売却する株数が保有数を超えています。",
          variant: "destructive",
        })
        return
      }

      const revenue = humidPrice * amount
      setHumidShares((prev) => prev - amount)
      setFunds((prev) => prev + revenue)

      toast({
        title: "売却完了",
        description: `湿度株 ${amount}株を${revenue}ptで売却しました。`,
      })
    }
  }

  // 予測を行う
  const makePrediction = () => {
    if (predictionAmount > funds) {
      toast({
        title: "資金不足",
        description: "予測に賭ける資金が足りません。",
        variant: "destructive",
      })
      return
    }

    // 資金から予測額を差し引く
    setFunds((prev) => prev - predictionAmount)

    // 予測を追加
    setActivePredictions((prev) => [
      ...prev,
      {
        type: predictionType,
        prediction: prediction,
        amount: predictionAmount,
        createdAt: currentStep,
        expiresAt: currentStep + 1, // 次のターンで結果が出る
      },
    ])

    setShowPredictionDialog(false)

    toast({
      title: "予測を開始",
      description: `${predictionType === "temperature" ? "気温" : "湿度"}が${prediction === "up" ? "上昇" : "下降"}すると予測し、${predictionAmount}ptを賭けました。`,
    })
  }

  // ゲームリセット
  const resetGame = () => {
    setFunds(10000)
    setDay(1)
    setData(initialData)
    setTempShares(0)
    setHumidShares(0)
    setTempPrice(100)
    setHumidPrice(100)
    setTempValue(0)
    setHumidValue(0)
    setGameOver(false)
    setCurrentStep(0)
    setActivePredictions([])
  }

  // 現在の総資産
  const totalAssets = funds + tempValue + humidValue

  // 現在の気温と湿度
  const currentTemp = data.length > 0 ? data[data.length - 1].temperature : 0
  const currentHumidity = data.length > 0 ? data[data.length - 1].humidity : 0

  // 前回からの変化
  const previousTemp = data.length > 1 ? data[data.length - 2].temperature : currentTemp
  const previousHumidity = data.length > 1 ? data[data.length - 2].humidity : currentHumidity

  const tempChange = currentTemp - previousTemp
  const tempChangePercent = previousTemp ? ((tempChange / previousTemp) * 100).toFixed(2) : "0.00"

  const humidityChange = currentHumidity - previousHumidity
  const humidityChangePercent = previousHumidity ? ((humidityChange / previousHumidity) * 100).toFixed(2) : "0.00"

  // プロフィール設定の確認
  const confirmProfile = () => {
    if (!region) {
      toast({
        title: "地方を選択してください",
        variant: "destructive",
      })
      return
    }

    if (!occupation) {
      toast({
        title: "職業を選択してください",
        variant: "destructive",
      })
      return
    }

    // プロフィール設定完了後、ゲーム開始
    startGame()
  }

  // ゲーム開始時の初期設定
  const startGame = () => {
    // 難易度に応じた初期資金設定
    let initialFunds = 10000
    if (difficulty === "easy") {
      initialFunds = 15000
    } else if (difficulty === "hard") {
      initialFunds = 5000
    }

    // 職業による初期ボーナス
    if (occupation === "金融関係") {
      initialFunds = Math.round(initialFunds * 1.2) // 金融関係は20%ボーナス
      toast({
        title: "金融のプロフェッショナル",
        description: "金融関係の職業ボーナスとして初期資金が20%増加しました！",
      })
    } else if (occupation === "経営者/役員") {
      initialFunds = Math.round(initialFunds * 1.3) // 経営者は30%ボーナス
      toast({
        title: "経営のプロフェッショナル",
        description: "経営者/役員の職業ボーナスとして初期資金が30%増加しました！",
      })
    }

    // 以下を追加
    // 地方による気象データの調整
    let adjustedInitialData = [...initialData]
    let adjustedNextPossibleData = [...nextPossibleData]

    // 地方ごとの気象特性に基づいてデータを調整
    if (region === "北海道") {
      // 北海道は気温が低め、湿度も低め
      adjustedInitialData = adjustedInitialData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature - 5) * 10) / 10,
        humidity: Math.round((d.humidity - 5) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature - 5) * 10) / 10,
        humidity: Math.round((d.humidity - 5) * 10) / 10,
      }))

      toast({
        title: "北海道の気象特性",
        description: "寒冷な気候のため、気温が低めに推移します。",
      })
    } else if (region === "東北") {
      // 東北は気温が低め、湿度は標準
      adjustedInitialData = adjustedInitialData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature - 3) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature - 3) * 10) / 10,
      }))

      toast({
        title: "東北の気象特性",
        description: "やませの影響で気温の変動が大きくなることがあります。",
      })
    } else if (region === "関東") {
      // 関東は気温が高め、湿度も高め（夏）
      adjustedInitialData = adjustedInitialData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + 2) * 10) / 10,
        humidity: Math.round((d.humidity + 3) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + 2) * 10) / 10,
        humidity: Math.round((d.humidity + 3) * 10) / 10,
      }))

      toast({
        title: "関東の気象特性",
        description: "夏は高温多湿で、気温と湿度が高めに推移します。",
      })
    } else if (region === "中部") {
      // 中部は気温の変動が大きい
      const randomFactor = Math.random() * 4 - 2 // -2から2の間のランダム値
      adjustedInitialData = adjustedInitialData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + randomFactor) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + randomFactor) * 10) / 10,
      }))

      toast({
        title: "中部の気象特性",
        description: "日本海側と太平洋側で気候が異なり、気温の変動が大きくなります。",
      })
    } else if (region === "近畿") {
      // 近畿は標準的だが、フェーン現象で急に気温が上がることも
      if (Math.random() > 0.7) {
        // 30%の確率でフェーン現象発生
        adjustedNextPossibleData[2].temperature += 5 // 15時の気温が急上昇

        toast({
          title: "近畿の気象特性",
          description: "フェーン現象により、午後に気温が急上昇する可能性があります。",
        })
      }
    } else if (region === "中国") {
      // 中国地方は瀬戸内側は温暖少雨
      adjustedInitialData = adjustedInitialData.map((d) => ({
        ...d,
        humidity: Math.round((d.humidity - 5) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        humidity: Math.round((d.humidity - 5) * 10) / 10,
      }))

      toast({
        title: "中国地方の気象特性",
        description: "瀬戸内海側は温暖少雨で、湿度が低めに推移します。",
      })
    } else if (region === "四国") {
      // 四国は温暖多雨（太平洋側）
      adjustedInitialData = adjustedInitialData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + 1) * 10) / 10,
        humidity: Math.round((d.humidity + 5) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + 1) * 10) / 10,
        humidity: Math.round((d.humidity + 5) * 10) / 10,
      }))

      toast({
        title: "四国の気象特性",
        description: "太平洋側は温暖多雨で、湿度が高めに推移します。",
      })
    } else if (region === "九州・沖縄") {
      // 九州・沖縄は気温が高め、湿度も高め
      adjustedInitialData = adjustedInitialData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + 4) * 10) / 10,
        humidity: Math.round((d.humidity + 7) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + 4) * 10) / 10,
        humidity: Math.round((d.humidity + 7) * 10) / 10,
      }))

      toast({
        title: "九州・沖縄の気象特性",
        description: "亜熱帯気候の影響で、気温と湿度が非常に高めに推移します。",
      })
    }

    setData(adjustedInitialData)
    // nextPossibleDataを直接変更するとゲーム中に参照できなくなるため、グローバル変数として保存
    window.adjustedNextPossibleData = adjustedNextPossibleData
    // 初期データも保存
    window.adjustedInitialData = adjustedInitialData

    setFunds(initialFunds)
    setDay(1)
    setTempShares(0)
    setHumidShares(0)
    setTempPrice(100)
    setHumidPrice(100)
    setTempValue(0)
    setHumidValue(0)
    setGameOver(false)
    setCurrentStep(0)
    setActivePredictions([])
    setShowTitleScreen(false)
    setShowProfileScreen(false)
    setShowOptions(false)

    // 難易度ハードの場合はチュートリアルをスキップ
    if (difficulty !== "hard") {
      setShowTutorial(true)
    }
  }

  // メニュー項目
  const menuItems = ["ニューゲーム", "コンティニュー", "オプション"]

  return (
    <div className="w-full max-w-5xl mx-auto">
      {showTitleScreen ? (
        // RPG風タイトル画面
        <div
          className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(to bottom, #87CEEB, #B0E0E6, #98FB98)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* 雲のアニメーション */}
          <div className="absolute top-10 left-10 opacity-70 animate-cloud-1">
            <Cloud className="h-24 w-24 text-white" />
          </div>
          <div className="absolute top-20 right-20 opacity-80 animate-cloud-2">
            <Cloud className="h-32 w-32 text-white" />
          </div>
          <div className="absolute bottom-40 left-1/4 opacity-60 animate-cloud-3">
            <Cloud className="h-20 w-20 text-white" />
          </div>

          {/* 太陽 */}
          <div className="absolute top-10 right-10">
            <Sun className="h-16 w-16 text-yellow-400 animate-pulse" />
          </div>

          {/* 木と丘 */}
          <div className="absolute bottom-0 right-10">
            <div className="w-40 h-60 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-full"></div>
            <div className="absolute bottom-40 right-10 w-60 h-20 bg-green-600 rounded-full"></div>
            <div className="absolute bottom-50 right-20">
              <div className="w-20 h-40 bg-green-800 rounded-t-full"></div>
            </div>
          </div>

          {/* タイトル */}
          <h1
            className="text-6xl font-bold mb-20 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider"
            style={{
              textShadow: "-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000",
              fontFamily: "'Press Start 2P', cursive, sans-serif",
            }}
          >
            気象投資
          </h1>

          {/* メニュー */}
          <div className="bg-gray-800 bg-opacity-70 rounded-lg p-6 w-64 border-2 border-gray-600">
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={`text-xl font-medium cursor-pointer transition-colors duration-200 ${
                    selectedMenuItem === index ? "text-yellow-300 pl-4 relative" : "text-white hover:text-yellow-200"
                  }`}
                  onClick={() => {
                    setSelectedMenuItem(index)
                    handleMenuSelect(index)
                  }}
                >
                  {selectedMenuItem === index && <span className="absolute left-0">▶</span>}
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute bottom-4 right-4 text-xs text-white">© 2023 気象投資 v1.0.0</div>
        </div>
      ) : showProfileScreen ? (
        // プロフィール設定画面
        <div
          className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(to bottom, #87CEEB, #B0E0E6, #98FB98)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-gray-800 bg-opacity-80 rounded-lg p-8 w-full max-w-md border-2 border-gray-600">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">プロフィール設定</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-white mr-2" />
                  <label className="text-white text-lg">お住まいの地方</label>
                </div>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="地方を選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-600 max-h-60">
                    {regions.map((reg) => (
                      <SelectItem key={reg.name} value={reg.name} className="hover:bg-gray-600">
                        {reg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {region && (
                  <div className="text-sm text-gray-300 mt-2 p-3 bg-gray-800 rounded-md">
                    <p className="font-semibold mb-1">{region}地方の気象特性:</p>
                    <p>{regions.find((r) => r.name === region)?.characteristics}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center mb-2">
                  <Briefcase className="h-5 w-5 text-white mr-2" />
                  <label className="text-white text-lg">ご職業</label>
                </div>
                <Select value={occupation} onValueChange={setOccupation}>
                  <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="職業を選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-600 max-h-60">
                    {occupations.map((occ) => (
                      <SelectItem key={occ} value={occ} className="hover:bg-gray-600">
                        {occ}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {occupation && (
                  <p className="text-sm text-gray-300 mt-1">
                    {occupation === "金融関係" && "金融のプロフェッショナルとして初期資金が20%増加します！"}
                    {occupation === "経営者/役員" && "経営のプロフェッショナルとして初期資金が30%増加します！"}
                    {occupation !== "金融関係" && occupation !== "経営者/役員" && `${occupation}として投資を始めます。`}
                  </p>
                )}
              </div>

              <div className="space-y-2 mt-6">
                <div className="flex items-center mb-2">
                  <label className="text-white text-lg">難易度設定</label>
                </div>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white border-gray-600"
                >
                  <option value="easy">初級（初期資金: 15,000pt）</option>
                  <option value="normal">中級（初期資金: 10,000pt）</option>
                  <option value="hard">上級（初期資金: 5,000pt）</option>
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowProfileScreen(false)
                    setShowTitleScreen(true)
                  }}
                  className="bg-gray-700 text-white hover:bg-gray-600 border-gray-500"
                >
                  戻る
                </Button>
                <Button onClick={confirmProfile} className="bg-blue-600 hover:bg-blue-700 text-white">
                  ゲームを始める
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : showOptions ? (
        // オプション画面
        <div
          className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(to bottom, #87CEEB, #B0E0E6, #98FB98)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-gray-800 bg-opacity-70 rounded-lg p-6 w-96 border-2 border-gray-600">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">オプション</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-white">BGM音量: {bgmVolume}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bgmVolume}
                  onChange={(e) => setBgmVolume(Number.parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white">効果音音量: {sfxVolume}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(Number.parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white">難易度</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  <option value="easy">初級（初期資金: 15,000pt）</option>
                  <option value="normal">中級（初期資金: 10,000pt）</option>
                  <option value="hard">上級（初期資金: 5,000pt）</option>
                </select>
              </div>

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                onClick={() => {
                  setShowOptions(false)
                  setShowTitleScreen(true)
                }}
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      ) : (
        // ゲーム画面
        <div className="p-4">
          {/* ゲームオーバーダイアログ */}
          <Dialog open={gameOver} onOpenChange={setGameOver}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ゲームオーバー</DialogTitle>
                <DialogDescription>資金が尽きてしまいました。あなたは{day}日間生き残りました。</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-center text-2xl font-bold">最終スコア: {day * 1000 + Math.round(totalAssets)}</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTitleScreen(true)}>
                  タイトルに戻る
                </Button>
                <Button onClick={resetGame}>もう一度プレイ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* チュートリアルダイアログ */}
          <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>気象投資へようこそ！</DialogTitle>
                <DialogDescription>このゲームでは、気温と湿度の変化を予測して投資を行います。</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <p>【ゲームの目的】</p>
                <p>気温株と湿度株を売買したり、天気の変化を予測して賭けることで資産を増やしましょう。</p>

                <p>【遊び方】</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>「株を買う」ボタンで気温株または湿度株を購入できます</li>
                  <li>「株を売る」ボタンで保有株を売却できます</li>
                  <li>「予測する」ボタンで次の時間の気温/湿度が上がるか下がるかを予測できます</li>
                  <li>「次の時間へ」ボタンで時間を進めます</li>
                </ul>

                <p>資金がなくなるとゲームオーバーです。できるだけ長く生き残りましょう！</p>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowTutorial(false)}>ゲームを始める</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 株購入ダイアログ */}
          <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>株の購入</DialogTitle>
                <DialogDescription>購入する株の種類と数量を選択してください。</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <RadioGroup value={buyType} onValueChange={setBuyType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="temperature" id="temperature" />
                    <Label htmlFor="temperature">気温株 (現在価格: {tempPrice}pt)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="humidity" id="humidity" />
                    <Label htmlFor="humidity">湿度株 (現在価格: {humidPrice}pt)</Label>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label htmlFor="amount">購入数量</Label>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setBuyAmount((prev) => Math.max(1, prev - 1))}>
                      -
                    </Button>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(Number.parseInt(e.target.value) || 1)}
                    />
                    <Button variant="outline" size="sm" onClick={() => setBuyAmount((prev) => prev + 1)}>
                      +
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    合計金額:{" "}
                    {buyType === "temperature"
                      ? tempPrice * buyAmount
                      : buyType === "humidity"
                        ? humidPrice * buyAmount
                        : 0}
                    pt
                  </p>
                  <p className="text-sm text-muted-foreground">現在の資金: {funds}pt</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBuyDialog(false)}>
                  キャンセル
                </Button>
                <Button onClick={buyShares} disabled={!buyType}>
                  購入する
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 予測ダイアログ */}
          <Dialog open={showPredictionDialog} onOpenChange={setShowPredictionDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>天気予測</DialogTitle>
                <DialogDescription>
                  次の時間の気温または湿度が上昇するか下降するかを予測し、賭けを行います。
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <RadioGroup value={predictionType} onValueChange={setPredictionType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="temperature" id="pred-temperature" />
                    <Label htmlFor="pred-temperature">気温</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="humidity" id="pred-humidity" />
                    <Label htmlFor="pred-humidity">湿度</Label>
                  </div>
                </RadioGroup>

                <RadioGroup value={prediction} onValueChange={setPrediction}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="up" id="pred-up" />
                    <Label htmlFor="pred-up" className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                      上昇する
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="down" id="pred-down" />
                    <Label htmlFor="pred-down" className="flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                      下降する
                    </Label>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label htmlFor="bet-amount">賭け金額</Label>
                  <Slider
                    id="bet-amount"
                    min={100}
                    max={funds}
                    step={100}
                    value={[predictionAmount]}
                    onValueChange={(values) => setPredictionAmount(values[0])}
                  />
                  <div className="flex justify-between">
                    <span>100pt</span>
                    <span>{predictionAmount}pt</span>
                    <span>{funds}pt</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    予測が当たると賭け金の2倍を獲得できます。外れると賭け金を失います。
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPredictionDialog(false)}>
                  キャンセル
                </Button>
                <Button onClick={makePrediction} disabled={!predictionType}>
                  予測する
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">気象投資</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {day}日目
              </Button>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                {data.length > 0 ? data[data.length - 1].time : "9:00"}
              </Button>
            </div>
          </div>

          {/* プレイヤー情報 */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center mb-2 md:mb-0">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{region}地方</span>
                  <Briefcase className="h-5 w-5 ml-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{occupation}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-1 text-green-500" />
                  <span className="text-xl font-bold">{totalAssets.toLocaleString()}pt</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 資産状況 */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">総資産</p>
                  <p className="text-2xl font-bold">{totalAssets.toLocaleString()}pt</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">現金</p>
                  <p className="text-xl">{funds.toLocaleString()}pt</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">気温株</p>
                  <p className="text-xl">
                    {tempShares}株 ({tempValue.toLocaleString()}pt)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">湿度株</p>
                  <p className="text-xl">
                    {humidShares}株 ({humidValue.toLocaleString()}pt)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>気温株 (TMP)</CardTitle>
                    <CardDescription>現在価格: {tempPrice}pt/株</CardDescription>
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
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" tickLine={false} axisLine={false} />
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
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBuyType("temperature")
                    setBuyAmount(1)
                    setShowBuyDialog(true)
                  }}
                >
                  株を買う
                </Button>
                <Button variant="outline" onClick={() => sellShares("temperature", 1)} disabled={tempShares < 1}>
                  株を売る
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPredictionType("temperature")
                    setPrediction("up")
                    setPredictionAmount(Math.min(1000, funds))
                    setShowPredictionDialog(true)
                  }}
                >
                  予測する
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>湿度株 (HMD)</CardTitle>
                    <CardDescription>現在価格: {humidPrice}pt/株</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{currentHumidity}%</div>
                    <div className={`flex items-center ${humidityChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {humidityChange >= 0 ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
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
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" tickLine={false} axisLine={false} />
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
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBuyType("humidity")
                    setBuyAmount(1)
                    setShowBuyDialog(true)
                  }}
                >
                  株を買う
                </Button>
                <Button variant="outline" onClick={() => sellShares("humidity", 1)} disabled={humidShares < 1}>
                  株を売る
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPredictionType("humidity")
                    setPrediction("up")
                    setPredictionAmount(Math.min(1000, funds))
                    setShowPredictionDialog(true)
                  }}
                >
                  予測する
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* アクティブな予測 */}
          {activePredictions.length > 0 && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>アクティブな予測</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activePredictions.map((pred, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center">
                        {pred.type === "temperature" ? "気温" : "湿度"}が
                        {pred.prediction === "up" ? (
                          <TrendingUp className="h-4 w-4 mx-1 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mx-1 text-red-500" />
                        )}
                        {pred.prediction === "up" ? "上昇" : "下降"}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {pred.amount}pt
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ゲームコントロール */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowTutorial(true)}>
                ゲーム説明
              </Button>
              <Button variant="outline" onClick={() => setShowTitleScreen(true)}>
                タイトルに戻る
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={advanceTurn}>次の時間へ</Button>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            <p>ヒント: 気温と湿度は通常、反比例の関係にあります。一方が上がると、もう一方は下がる傾向があります。</p>
          </div>
        </div>
      )}
    </div>
  )
}

