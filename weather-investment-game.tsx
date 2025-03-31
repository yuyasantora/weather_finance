"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, Cloud, Sun, CloudRain, CloudSun, TreesIcon as Tree, Leaf } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

// 初期データ
const initialData = [
  { time: "9:00", temperature: 18.2, humidity: 65, sunshine: 30, precipitation: 0, vegetable: 100 },
  { time: "10:00", temperature: 19.5, humidity: 62, sunshine: 45, precipitation: 0, vegetable: 102 },
  { time: "11:00", temperature: 21.3, humidity: 58, sunshine: 70, precipitation: 0, vegetable: 105 },
  { time: "12:00", temperature: 22.8, humidity: 55, sunshine: 85, precipitation: 0, vegetable: 108 },
]

// 予測可能な次のデータポイント
const nextPossibleData = [
  { time: "13:00", temperature: 23.5, humidity: 52, sunshine: 90, precipitation: 0, vegetable: 110 },
  { time: "14:00", temperature: 24.1, humidity: 50, sunshine: 95, precipitation: 0, vegetable: 112 },
  { time: "15:00", temperature: 23.8, humidity: 51, sunshine: 80, precipitation: 5, vegetable: 109 },
  { time: "16:00", temperature: 22.5, humidity: 54, sunshine: 60, precipitation: 10, vegetable: 106 },
  { time: "17:00", temperature: 21.0, humidity: 58, sunshine: 40, precipitation: 15, vegetable: 104 },
]

// 一週間の天気予報データを7週間分に拡張
const weeklyForecastData = [
  // 第1週
  [
    { day: "月", weather: "sunny", tempHigh: 24, tempLow: 18, precipitation: 0 },
    { day: "火", weather: "sunny", tempHigh: 25, tempLow: 19, precipitation: 0 },
    { day: "水", weather: "partly-cloudy", tempHigh: 23, tempLow: 17, precipitation: 20 },
    { day: "木", weather: "rainy", tempHigh: 21, tempLow: 16, precipitation: 80 },
    { day: "金", weather: "rainy", tempHigh: 20, tempLow: 15, precipitation: 60 },
    { day: "土", weather: "partly-cloudy", tempHigh: 22, tempLow: 16, precipitation: 30 },
    { day: "日", weather: "sunny", tempHigh: 24, tempLow: 18, precipitation: 0 },
  ],
  // 第2週
  [
    { day: "月", weather: "partly-cloudy", tempHigh: 22, tempLow: 17, precipitation: 30 },
    { day: "火", weather: "rainy", tempHigh: 19, tempLow: 15, precipitation: 90 },
    { day: "水", weather: "rainy", tempHigh: 18, tempLow: 14, precipitation: 100 },
    { day: "木", weather: "rainy", tempHigh: 17, tempLow: 13, precipitation: 70 },
    { day: "金", weather: "partly-cloudy", tempHigh: 20, tempLow: 15, precipitation: 40 },
    { day: "土", weather: "sunny", tempHigh: 23, tempLow: 17, precipitation: 10 },
    { day: "日", weather: "sunny", tempHigh: 25, tempLow: 18, precipitation: 0 },
  ],
  // 第3週
  [
    { day: "月", weather: "sunny", tempHigh: 27, tempLow: 20, precipitation: 0 },
    { day: "火", weather: "sunny", tempHigh: 28, tempLow: 21, precipitation: 0 },
    { day: "水", weather: "sunny", tempHigh: 29, tempLow: 22, precipitation: 0 },
    { day: "木", weather: "partly-cloudy", tempHigh: 27, tempLow: 21, precipitation: 20 },
    { day: "金", weather: "partly-cloudy", tempHigh: 26, tempLow: 20, precipitation: 30 },
    { day: "土", weather: "rainy", tempHigh: 24, tempLow: 19, precipitation: 60 },
    { day: "日", weather: "rainy", tempHigh: 22, tempLow: 18, precipitation: 80 },
  ],
  // 第4週
  [
    { day: "月", weather: "rainy", tempHigh: 21, tempLow: 17, precipitation: 70 },
    { day: "火", weather: "partly-cloudy", tempHigh: 23, tempLow: 18, precipitation: 40 },
    { day: "水", weather: "partly-cloudy", tempHigh: 24, tempLow: 19, precipitation: 30 },
    { day: "木", weather: "sunny", tempHigh: 26, tempLow: 20, precipitation: 10 },
    { day: "金", weather: "sunny", tempHigh: 27, tempLow: 21, precipitation: 0 },
    { day: "土", weather: "sunny", tempHigh: 28, tempLow: 22, precipitation: 0 },
    { day: "日", weather: "partly-cloudy", tempHigh: 26, tempLow: 21, precipitation: 20 },
  ],
  // 第5週
  [
    { day: "月", weather: "partly-cloudy", tempHigh: 25, tempLow: 20, precipitation: 30 },
    { day: "火", weather: "rainy", tempHigh: 23, tempLow: 19, precipitation: 60 },
    { day: "水", weather: "rainy", tempHigh: 21, tempLow: 17, precipitation: 80 },
    { day: "木", weather: "rainy", tempHigh: 20, tempLow: 16, precipitation: 90 },
    { day: "金", weather: "rainy", tempHigh: 19, tempLow: 15, precipitation: 100 },
    { day: "土", weather: "partly-cloudy", tempHigh: 21, tempLow: 16, precipitation: 50 },
    { day: "日", weather: "partly-cloudy", tempHigh: 22, tempLow: 17, precipitation: 40 },
  ],
  // 第6週
  [
    { day: "月", weather: "sunny", tempHigh: 24, tempLow: 18, precipitation: 10 },
    { day: "火", weather: "sunny", tempHigh: 26, tempLow: 20, precipitation: 0 },
    { day: "水", weather: "sunny", tempHigh: 28, tempLow: 22, precipitation: 0 },
    { day: "木", weather: "sunny", tempHigh: 29, tempLow: 23, precipitation: 0 },
    { day: "金", weather: "partly-cloudy", tempHigh: 27, tempLow: 22, precipitation: 20 },
    { day: "土", weather: "partly-cloudy", tempHigh: 25, tempLow: 20, precipitation: 30 },
    { day: "日", weather: "rainy", tempHigh: 23, tempLow: 19, precipitation: 70 },
  ],
  // 第7週
  [
    { day: "月", weather: "rainy", tempHigh: 21, tempLow: 17, precipitation: 80 },
    { day: "火", weather: "rainy", tempHigh: 20, tempLow: 16, precipitation: 90 },
    { day: "水", weather: "partly-cloudy", tempHigh: 22, tempLow: 17, precipitation: 50 },
    { day: "木", weather: "partly-cloudy", tempHigh: 23, tempLow: 18, precipitation: 30 },
    { day: "金", weather: "sunny", tempHigh: 25, tempLow: 19, precipitation: 10 },
    { day: "土", weather: "sunny", tempHigh: 27, tempLow: 21, precipitation: 0 },
    { day: "日", weather: "sunny", tempHigh: 28, tempLow: 22, precipitation: 0 },
  ],
]

// 一週間の天気予報データ（初期値は第1週）
const weeklyForecast = weeklyForecastData[0]

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

// 天気アイコンコンポーネント
const WeatherIcon = ({ weather, size = 5 }: { weather: string; size?: number }) => {
  switch (weather) {
    case "sunny":
      return <Sun className={`h-${size} w-${size} text-yellow-400`} />
    case "partly-cloudy":
      return <CloudSun className={`h-${size} w-${size} text-gray-400`} />
    case "cloudy":
      return <Cloud className={`h-${size} w-${size} text-gray-400`} />
    case "rainy":
      return <CloudRain className={`h-${size} w-${size} text-blue-400`} />
    default:
      return <Sun className={`h-${size} w-${size} text-yellow-400`} />
  }
}

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
  const [currentWeek, setCurrentWeek] = useState(0) // 現在の週（0-6）
  const [showForecastBanner, setShowForecastBanner] = useState(true) // 天気予報バナー表示フラグ

  // 株の保有数
  const [tempShares, setTempShares] = useState(0) // 気温株の保有数
  const [sunshineShares, setSunshineShares] = useState(0) // 日照株の保有数
  const [precipShares, setPrecipShares] = useState(0) // 降水量株の保有数
  const [vegShares, setVegShares] = useState(0) // 野菜株の保有数

  // 株価
  const [tempPrice, setTempPrice] = useState(100) // 気温株の現在価格
  const [sunshinePrice, setSunshinePrice] = useState(100) // 日照株の現在価格
  const [precipPrice, setPrecipPrice] = useState(100) // 降水量株の現在価格
  const [vegPrice, setVegPrice] = useState(100) // 野菜株の現在価格

  // 株の保有価値
  const [tempValue, setTempValue] = useState(0) // 気温株の保有価値
  const [sunshineValue, setSunshineValue] = useState(0) // 日照株の保有価値
  const [precipValue, setPrecipValue] = useState(0) // 降水量株の保有価値
  const [vegValue, setVegValue] = useState(0) // 野菜株の保有価値

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
  const [activePredictions, setActivePredictions] = useState<{ type: string; prediction: string; amount: number; createdAt: number; expiresAt: number; }[]>([]) // アクティブな予測リストの型を明示
  const [showOptions, setShowOptions] = useState(false) // オプション画面表示フラグ
  const [selectedMenuItem, setSelectedMenuItem] = useState(0) // 選択中のメニュー項目
  const [bgmVolume, setBgmVolume] = useState(50) // BGM音量
  const [sfxVolume, setSfxVolume] = useState(50) // 効果音音量
  const [activeTab, setActiveTab] = useState("temperature") // アクティブなタブ

  // 株価の計算（気象データの変化に基づく）
  useEffect(() => {
    if (data.length > 1) {
      const lastData = data[data.length - 1]
      const prevData = data[data.length - 2]

      // 気温株の価格計算
      const tempChange = ((lastData.temperature - prevData.temperature) / prevData.temperature) * 10
      setTempPrice((prev) => Math.max(1, Math.round(prev * (1 + tempChange / 100))))

      // 日照株の価格計算
      const sunshineChange = ((lastData.sunshine - prevData.sunshine) / Math.max(1, prevData.sunshine)) * 10
      setSunshinePrice((prev) => Math.max(1, Math.round(prev * (1 + sunshineChange / 100))))

      // 降水量株の価格計算 (降水量は0の場合があるので特別処理)
      let precipChange = 0
      if (prevData.precipitation === 0 && lastData.precipitation > 0) {
        // 降水量が0から増加した場合は大幅上昇
        precipChange = 5
      } else if (prevData.precipitation > 0 && lastData.precipitation === 0) {
        // 降水量が0になった場合は下落
        precipChange = -3
      } else if (prevData.precipitation > 0 && lastData.precipitation > 0) {
        // 両方とも0より大きい場合は通常計算
        precipChange = ((lastData.precipitation - prevData.precipitation) / prevData.precipitation) * 10
      }
      setPrecipPrice((prev) => Math.max(1, Math.round(prev * (1 + precipChange / 100))))

      // 野菜株の価格計算
      const vegChange = ((lastData.vegetable - prevData.vegetable) / prevData.vegetable) * 10
      setVegPrice((prev) => Math.max(1, Math.round(prev * (1 + vegChange / 100))))
    }
  }, [data])

  // 保有株の価値計算
  useEffect(() => {
    setTempValue(tempShares * tempPrice)
    setSunshineValue(sunshineShares * sunshinePrice)
    setPrecipValue(precipShares * precipPrice)
    setVegValue(vegShares * vegPrice)

    // ゲームオーバー判定（資金が0かつ株も持っていない）
    const totalAssetValue = tempValue + sunshineValue + precipValue + vegValue
    if (funds <= 0 && totalAssetValue <= 0) {
      setGameOver(true)
    }
  }, [
    funds,
    tempShares,
    sunshineShares,
    precipShares,
    vegShares,
    tempPrice,
    sunshinePrice,
    precipPrice,
    vegPrice,
    tempValue,
    sunshineValue,
    precipValue,
    vegValue,
  ])

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  const handleMenuSelect = (index: number) => {
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
    const dataToUse = (window as any).adjustedNextPossibleData || nextPossibleData

    if (currentStep >= dataToUse.length) {
      // 一日の終了、次の日へ
      const newDay = day + 1
      setDay(newDay)
      setCurrentStep(0)

      // 7日ごとに週を更新
      if (newDay % 7 === 1 && newDay > 1) {
        const nextWeek = (currentWeek + 1) % 7
        setCurrentWeek(nextWeek)
      }

      // データをリセットして新しい日を始める
      // 初期データも調整されている場合はそれを使用
      const initialDataToUse = (window as any).adjustedInitialData || initialData
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
    const newPredictions: { type: string; prediction: string; amount: number; createdAt: number; expiresAt: number; }[] = []

    activePredictions.forEach((pred) => {
      if (pred.expiresAt === currentStep + 1) {
        // 予測の判定時間
        const lastIndex = data.length - 1
        let currentValue, prevValue

        // 予測タイプに応じた値を取得
        switch (pred.type) {
          case "temperature":
            currentValue = data[lastIndex].temperature
            prevValue = data[lastIndex - 1].temperature
            break
          case "sunshine":
            currentValue = data[lastIndex].sunshine
            prevValue = data[lastIndex - 1].sunshine
            break
          case "precipitation":
            currentValue = data[lastIndex].precipitation
            prevValue = data[lastIndex - 1].precipitation
            break
          case "vegetable":
            currentValue = data[lastIndex].vegetable
            prevValue = data[lastIndex - 1].vegetable
            break
          default:
            currentValue = data[lastIndex].temperature
            prevValue = data[lastIndex - 1].temperature
        }

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
    let cost = 0

    // 株の種類に応じた価格計算
    switch (buyType) {
      case "temperature":
        cost = tempPrice * buyAmount
        break
      case "sunshine":
        cost = sunshinePrice * buyAmount
        break
      case "precipitation":
        cost = precipPrice * buyAmount
        break
      case "vegetable":
        cost = vegPrice * buyAmount
        break
      default:
        cost = 0
    }

    if (cost > funds) {
      toast({
        title: "資金不足",
        description: "購入するための資金が足りません。",
        variant: "destructive",
      })
      return
    }

    // 株の種類に応じた保有数更新
    switch (buyType) {
      case "temperature":
        setTempShares((prev) => prev + buyAmount)
        break
      case "sunshine":
        setSunshineShares((prev) => prev + buyAmount)
        break
      case "precipitation":
        setPrecipShares((prev) => prev + buyAmount)
        break
      case "vegetable":
        setVegShares((prev) => prev + buyAmount)
        break
    }

    setFunds((prev) => prev - cost)
    setShowBuyDialog(false)

    // 株の種類に応じたメッセージ
    let stockName = ""
    switch (buyType) {
      case "temperature":
        stockName = "気温株"
        break
      case "sunshine":
        stockName = "日照株"
        break
      case "precipitation":
        stockName = "降水量株"
        break
      case "vegetable":
        stockName = "野菜株"
        break
    }

    toast({
      title: "購入完了",
      description: `${stockName} ${buyAmount}株を${cost}ptで購入しました。`,
    })
  }

  // 株の売却
  const sellShares = (type: string, amount: number) => {
    let shares = 0
    let price = 0
    let stockName = ""

    // 株の種類に応じた情報取得
    switch (type) {
      case "temperature":
        shares = tempShares
        price = tempPrice
        stockName = "気温株"
        break
      case "sunshine":
        shares = sunshineShares
        price = sunshinePrice
        stockName = "日照株"
        break
      case "precipitation":
        shares = precipShares
        price = precipPrice
        stockName = "降水量株"
        break
      case "vegetable":
        shares = vegShares
        price = vegPrice
        stockName = "野菜株"
        break
    }

    if (shares < amount) {
      toast({
        title: "株数不足",
        description: "売却する株数が保有数を超えています。",
        variant: "destructive",
      })
      return
    }

    const revenue = price * amount

    // 株の種類に応じた保有数更新
    switch (type) {
      case "temperature":
        setTempShares((prev) => prev - amount)
        break
      case "sunshine":
        setSunshineShares((prev) => prev - amount)
        break
      case "precipitation":
        setPrecipShares((prev) => prev - amount)
        break
      case "vegetable":
        setVegShares((prev) => prev - amount)
        break
    }

    setFunds((prev) => prev + revenue)

    toast({
      title: "売却完了",
      description: `${stockName} ${amount}株を${revenue}ptで売却しました。`,
    })
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

    // 株の種類に応じたメッセージ
    let typeName = ""
    switch (predictionType) {
      case "temperature":
        typeName = "気温"
        break
      case "sunshine":
        typeName = "日照量"
        break
      case "precipitation":
        typeName = "降水量"
        break
      case "vegetable":
        typeName = "野菜価格"
        break
    }

    toast({
      title: "予測を開始",
      description: `${typeName}が${prediction === "up" ? "上昇" : "下降"}すると予測し、${predictionAmount}ptを賭けました。`,
    })
  }

  // ゲームリセット
  const resetGame = () => {
    setFunds(10000)
    setDay(1)
    setData(initialData)
    setTempShares(0)
    setSunshineShares(0)
    setPrecipShares(0)
    setVegShares(0)
    setTempPrice(100)
    setSunshinePrice(100)
    setPrecipPrice(100)
    setVegPrice(100)
    setTempValue(0)
    setSunshineValue(0)
    setPrecipValue(0)
    setVegValue(0)
    setGameOver(false)
    setCurrentStep(0)
    setActivePredictions([])
  }

  // 現在の総資産
  const totalAssets = funds + tempValue + sunshineValue + precipValue + vegValue

  // 現在の気象データ
  const currentTemp = data.length > 0 ? data[data.length - 1].temperature : 0
  const currentSunshine = data.length > 0 ? data[data.length - 1].sunshine : 0
  const currentPrecip = data.length > 0 ? data[data.length - 1].precipitation : 0
  const currentVeg = data.length > 0 ? data[data.length - 1].vegetable : 0

  // 前回からの変化
  const previousTemp = data.length > 1 ? data[data.length - 2].temperature : currentTemp
  const previousSunshine = data.length > 1 ? data[data.length - 2].sunshine : currentSunshine
  const previousPrecip = data.length > 1 ? data[data.length - 2].precipitation : currentPrecip
  const previousVeg = data.length > 1 ? data[data.length - 2].vegetable : currentVeg

  const tempChange = currentTemp - previousTemp
  const tempChangePercent = previousTemp ? ((tempChange / previousTemp) * 100).toFixed(2) : "0.00"

  const sunshineChange = currentSunshine - previousSunshine
  const sunshineChangePercent = previousSunshine ? ((sunshineChange / previousSunshine) * 100).toFixed(2) : "0.00"

  const precipChange = currentPrecip - previousPrecip
  const precipChangePercent = previousPrecip ? ((precipChange / previousPrecip) * 100).toFixed(2) : "0.00"

  const vegChange = currentVeg - previousVeg
  const vegChangePercent = previousVeg ? ((vegChange / previousVeg) * 100).toFixed(2) : "0.00"

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
    } else if (occupation === "農林水産業") {
      // 農林水産業は野菜株の初期保有
      setVegShares(10)
      toast({
        title: "農業のプロフェッショナル",
        description: "農林水産業の職業ボーナスとして野菜株10株が付与されました！",
      })
    }

    // 以下を追加
    // 地方による気象データの調整
    let adjustedInitialData = [...initialData]
    let adjustedNextPossibleData = [...nextPossibleData]

    // 地方ごとの気象特性に基づいてデータを調整
    if (region === "北海道") {
      // 北海道は気温が低め、湿度も低め、日照時間短め
      adjustedInitialData = adjustedInitialData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature - 5) * 10) / 10,
        humidity: Math.round((d.humidity - 5) * 10) / 10,
        sunshine: Math.round((d.sunshine - 10) * 10) / 10,
        vegetable: Math.round((d.vegetable - 5) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature - 5) * 10) / 10,
        humidity: Math.round((d.humidity - 5) * 10) / 10,
        sunshine: Math.round((d.sunshine - 10) * 10) / 10,
        vegetable: Math.round((d.vegetable - 5) * 10) / 10,
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
        vegetable: Math.round((d.vegetable - 3) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature - 3) * 10) / 10,
        vegetable: Math.round((d.vegetable - 3) * 10) / 10,
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
        sunshine: Math.round((d.sunshine + 5) * 10) / 10,
        vegetable: Math.round((d.vegetable + 2) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + 2) * 10) / 10,
        humidity: Math.round((d.humidity + 3) * 10) / 10,
        sunshine: Math.round((d.sunshine + 5) * 10) / 10,
        vegetable: Math.round((d.vegetable + 2) * 10) / 10,
      }))

      toast({
        title: "関東の気象特性",
        description: "夏は高温多湿で、気温と湿度が高めに推移します。",
      })
    } else if (region === "中部") {
      // 中部は気温の変動が大きい - 固定値に変更
      const randomFactor = (day % 5) - 2 // -2から2の間の決定論的な値
      adjustedInitialData = adjustedInitialData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + randomFactor) * 10) / 10,
        vegetable: Math.round((d.vegetable + randomFactor) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + randomFactor) * 10) / 10,
        vegetable: Math.round((d.vegetable + randomFactor) * 10) / 10,
      }))

      toast({
        title: "中部の気象特性",
        description: "日本海側と太平洋側で気候が異なり、気温の変動が大きくなります。",
      })
    } else if (region === "近畿") {
      // 近畿は標準的だが、フェーン現象で急に気温が上がることも
      if (day % 10 < 3) {
        // 30%の確率でフェーン現象発生（日付に基づく決定論的な条件）
        adjustedNextPossibleData[2].temperature += 5 // 15時の気温が急上昇
        adjustedNextPossibleData[2].sunshine += 10 // 日照量も増加

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
        precipitation: Math.max(0, Math.round((d.precipitation - 5) * 10) / 10),
        sunshine: Math.round((d.sunshine + 8) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        humidity: Math.round((d.humidity - 5) * 10) / 10,
        precipitation: Math.max(0, Math.round((d.precipitation - 5) * 10) / 10),
        sunshine: Math.round((d.sunshine + 8) * 10) / 10,
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
        precipitation: Math.round((d.precipitation + 10) * 10) / 10,
        vegetable: Math.round((d.vegetable + 5) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + 1) * 10) / 10,
        humidity: Math.round((d.humidity + 5) * 10) / 10,
        precipitation: Math.round((d.precipitation + 10) * 10) / 10,
        vegetable: Math.round((d.vegetable + 5) * 10) / 10,
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
        sunshine: Math.round((d.sunshine + 10) * 10) / 10,
        vegetable: Math.round((d.vegetable + 8) * 10) / 10,
      }))
      adjustedNextPossibleData = adjustedNextPossibleData.map((d) => ({
        ...d,
        temperature: Math.round((d.temperature + 4) * 10) / 10,
        humidity: Math.round((d.humidity + 7) * 10) / 10,
        sunshine: Math.round((d.sunshine + 10) * 10) / 10,
        vegetable: Math.round((d.vegetable + 8) * 10) / 10,
      }))

      toast({
        title: "九州・沖縄の気象特性",
        description: "亜熱帯気候の影響で、気温と湿度が非常に高めに推移します。",
      })
    }

    setData([...adjustedInitialData])
    (window as any).adjustedNextPossibleData = [...adjustedNextPossibleData]
    (window as any).adjustedInitialData = [...adjustedInitialData]

    setFunds(initialFunds)
    setDay(1)
    setTempShares(0)
    setSunshineShares(0)
    setPrecipShares(0)
    setVegShares(occupation === "農林水産業" ? 10 : 0)
    setTempPrice(100)
    setSunshinePrice(100)
    setPrecipPrice(100)
    setVegPrice(100)
    setTempValue(0)
    setSunshineValue(0)
    setPrecipValue(0)
    setVegValue(0)
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

  // 天気予報バナーコンポーネント
  const WeatherForecastBanner = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
      <div className="sticky top-0 z-50 transition-all duration-300">
        <Card className="mb-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-b border-green-200 dark:border-green-700 shadow-md">
          <CardContent className="p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold mr-2">7週間天気予報</h3>
                <span className="text-sm text-muted-foreground">{region}地方</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
                  {isCollapsed ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {!isCollapsed && (
              <div className="grid grid-cols-7 gap-1">
                {weeklyForecastData.map((weekData, weekIndex) => {
                  // Get only Monday (first day) of each week
                  const mondayForecast = weekData[0]

                  return (
                    <div
                      key={weekIndex}
                      className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                        weekIndex === currentWeek
                          ? "bg-green-200 dark:bg-green-700"
                          : "hover:bg-green-200 dark:hover:bg-green-700"
                      }`}
                    >
                      <span className="text-sm font-medium">第{weekIndex + 1}週</span>
                      <span className="text-xs text-muted-foreground">月曜日</span>
                      <WeatherIcon weather={mondayForecast.weather} size={6} />
                      <div className="text-xs mt-1 flex items-center justify-center">
                        <span className="text-red-500 mr-1">{mondayForecast.tempHigh}°</span>
                        <span className="text-blue-500">{mondayForecast.tempLow}°</span>
                      </div>
                      <span className="text-xs text-blue-500">
                        {mondayForecast.precipitation > 0 ? `${mondayForecast.precipitation}%` : ""}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // メインコンポーネントのレンダリング部分
  return (
    <div className="min-h-screen bg-background">
      {/* タイトル画面 */}
      {showTitleScreen && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-300 to-green-600 dark:from-green-800 dark:to-green-950 p-4 overflow-hidden relative">
          {/* 背景の草原と空 */}
          <div className="absolute inset-0 overflow-hidden">
            {/* 空 */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-500 dark:from-blue-800 dark:to-blue-900"></div>

            {/* 雲 */}
            <div className="absolute top-10 left-10 opacity-70 animate-cloud-1">
              <Cloud className="h-24 w-24 text-white" />
            </div>
            <div className="absolute top-20 right-20 opacity-60 animate-cloud-2">
              <Cloud className="h-32 w-32 text-white" />
            </div>
            <div className="absolute bottom-[60%] left-1/4 opacity-65 animate-cloud-3">
              <Cloud className="h-20 w-20 text-white" />
            </div>

            {/* 草原 */}
            <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-green-600 to-green-500 dark:from-green-800 dark:to-green-700"></div>

            {/* 木と岩 */}
            <div className="absolute bottom-[58%] right-10">
              <div className="relative">
                {/* 岩 */}
                <div className="absolute bottom-0 right-0 w-32 h-24 bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-700 dark:to-gray-900 rounded-tl-3xl rounded-tr-lg rounded-bl-lg rounded-br-2xl"></div>
                {/* 木 */}
                <div className="absolute bottom-16 right-10">
                  <Tree className="h-20 w-20 text-green-800 dark:text-green-700" />
                </div>
              </div>
            </div>

            {/* 小さな花 - 固定位置に変更 */}
            {Array.from({ length: 20 }).map((_, i) => {
              // インデックスに基づいた決定論的な位置計算
              const bottom = 5 + (i % 6) * 5
              const left = 5 + ((i * 4.5) % 90)
              const opacity = 0.5 + (i % 5) / 10

              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-yellow-200 dark:bg-yellow-300"
                  style={{
                    bottom: `${bottom}%`,
                    left: `${left}%`,
                    opacity: opacity,
                  }}
                ></div>
              )
            })}
          </div>

          {/* タイトルと装飾 */}
          <div className="relative z-10 bg-white/20 backdrop-blur-sm p-8 rounded-lg border border-white/30 shadow-2xl mb-8">
            <h1
              className="text-5xl font-bold mb-2 text-white text-center text-shadow-lg"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
              }}
            >
              気象投資ゲーム
            </h1>
            <div
              className="text-xl text-white text-center mb-4 text-shadow-sm"
              style={{
                textShadow: "1px 1px 0 #000",
              }}
            >
              Weather Investment Game
            </div>
            <div className="flex justify-center space-x-4 text-white">
              <div className="flex items-center">
                <Sun className="h-5 w-5 mr-1 text-yellow-300" />
                <span>気温</span>
              </div>
              <div className="flex items-center">
                <Leaf className="h-5 w-5 mr-1 text-green-300" />
                <span>野菜</span>
              </div>
              <div className="flex items-center">
                <CloudRain className="h-5 w-5 mr-1 text-blue-300" />
                <span>降水量</span>
              </div>
            </div>
          </div>

          {/* メニュー */}
          <div className="w-64 space-y-3 z-10 bg-green-800/50 backdrop-blur-sm p-4 rounded-lg border border-green-400/30 shadow-lg">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant={selectedMenuItem === index ? "default" : "outline"}
                className={`w-full transition-all duration-200 ${
                  selectedMenuItem === index
                    ? "bg-green-500 hover:bg-green-600 text-white border-green-300"
                    : "bg-green-900/50 hover:bg-green-800 text-green-100 border-green-700/50"
                }`}
                onClick={() => handleMenuSelect(index)}
              >
                {item}
              </Button>
            ))}
          </div>

          {/* バージョン情報 */}
          <div className="absolute bottom-4 right-4 text-xs text-white opacity-70">Ver 1.0.0</div>
        </div>
      )}

      {/* プロフィール設定画面 */}
      {showProfileScreen && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-4">
          <h1 className="text-2xl font-bold mb-6">プロフィール設定</h1>
          <div className="w-full max-w-md space-y-4">
            <div>
              <h2 className="text-lg font-medium mb-2">難易度</h2>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={difficulty === "easy" ? "default" : "outline"}
                  onClick={() => setDifficulty("easy")}
                  className={difficulty === "easy" ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  初級
                </Button>
                <Button
                  variant={difficulty === "normal" ? "default" : "outline"}
                  onClick={() => setDifficulty("normal")}
                  className={difficulty === "normal" ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  中級
                </Button>
                <Button
                  variant={difficulty === "hard" ? "default" : "outline"}
                  onClick={() => setDifficulty("hard")}
                  className={difficulty === "hard" ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  上級
                </Button>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">地方選択</h2>
              <div className="grid grid-cols-2 gap-2">
                {regions.map((r) => (
                  <Button
                    key={r.name}
                    variant={region === r.name ? "default" : "outline"}
                    onClick={() => setRegion(r.name)}
                    className={`justify-start ${region === r.name ? "bg-green-500 hover:bg-green-600" : ""}`}
                  >
                    {r.name}
                  </Button>
                ))}
              </div>
              {region && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900 rounded text-sm">
                  {regions.find((r) => r.name === region)?.characteristics}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">職業選択</h2>
              <div className="grid grid-cols-2 gap-2">
                {occupations.map((o) => (
                  <Button
                    key={o}
                    variant={occupation === o ? "default" : "outline"}
                    onClick={() => setOccupation(o)}
                    className={`justify-start ${occupation === o ? "bg-green-500 hover:bg-green-600" : ""}`}
                  >
                    {o}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowProfileScreen(false)}>
                戻る
              </Button>
              <Button onClick={confirmProfile} className="bg-green-500 hover:bg-green-600">
                ゲーム開始
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* オプション画面 */}
      {showOptions && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-4">
          <h1 className="text-2xl font-bold mb-6">オプション</h1>
          <div className="w-full max-w-md space-y-4">
            <div>
              <h2 className="text-lg font-medium mb-2">BGM音量</h2>
              <input
                type="range"
                min="0"
                max="100"
                value={bgmVolume}
                onChange={(e) => setBgmVolume(Number.parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-right">{bgmVolume}%</div>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">効果音音量</h2>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVolume}
                onChange={(e) => setSfxVolume(Number.parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-right">{sfxVolume}%</div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={() => {
                  setShowOptions(false)
                  setShowTitleScreen(true)
                }}
                className="bg-green-500 hover:bg-green-600"
              >
                戻る
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* メインゲーム画面 */}
      {!showTitleScreen && !showProfileScreen && !showOptions && (
        <div className="container mx-auto p-4">
          {/* 天気予報バナー */}
          {showForecastBanner && <WeatherForecastBanner />}

          {/* ゲーム情報ヘッダー */}
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">気象投資ゲーム</h1>
              <div className="text-sm text-muted-foreground">
                {region}地方 - {day}日目
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xl font-bold">{funds.toLocaleString()}pt</div>
              <div className="text-sm text-muted-foreground">総資産: {totalAssets.toLocaleString()}pt</div>
            </div>
          </div>

          {/* 気象データ表示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* 気温データ */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">気温</h3>
                    <div className="text-2xl font-bold">{currentTemp}°C</div>
                  </div>
                  <div className={`flex items-center ${tempChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {tempChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {Math.abs(tempChange).toFixed(1)}°C ({tempChangePercent}%)
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">株価: {tempPrice}pt</div>
                    <div className="text-sm">
                      保有: {tempShares}株 ({tempValue.toLocaleString()}pt)
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setBuyType("temperature")
                        setShowBuyDialog(true)
                      }}
                      className="bg-green-50 hover:bg-green-100"
                    >
                      購入
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sellShares("temperature", tempShares)}
                      disabled={tempShares <= 0}
                      className="bg-green-50 hover:bg-green-100"
                    >
                      売却
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 日照データ */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">日照量</h3>
                    <div className="text-2xl font-bold">{currentSunshine}</div>
                  </div>
                  <div className={`flex items-center ${sunshineChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {sunshineChange >= 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(sunshineChange).toFixed(1)} ({sunshineChangePercent}%)
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">株価: {sunshinePrice}pt</div>
                    <div className="text-sm">
                      保有: {sunshineShares}株 ({sunshineValue.toLocaleString()}pt)
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setBuyType("sunshine")
                        setShowBuyDialog(true)
                      }}
                      className="bg-green-50 hover:bg-green-100"
                    >
                      購入
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sellShares("sunshine", sunshineShares)}
                      disabled={sunshineShares <= 0}
                      className="bg-green-50 hover:bg-green-100"
                    >
                      売却
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 降水量データ */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">降水量</h3>
                    <div className="text-2xl font-bold">{currentPrecip}</div>
                  </div>
                  <div className={`flex items-center ${precipChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {precipChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {Math.abs(precipChange).toFixed(1)} ({precipChangePercent}%)
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">株価: {precipPrice}pt</div>
                    <div className="text-sm">
                      保有: {precipShares}株 ({precipValue.toLocaleString()}pt)
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setBuyType("precipitation")
                        setShowBuyDialog(true)
                      }}
                      className="bg-green-50 hover:bg-green-100"
                    >
                      購入
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sellShares("precipitation", precipShares)}
                      disabled={precipShares <= 0}
                      className="bg-green-50 hover:bg-green-100"
                    >
                      売却
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 野菜価格データ */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">野菜価格</h3>
                    <div className="text-2xl font-bold">{currentVeg}</div>
                  </div>
                  <div className={`flex items-center ${vegChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {vegChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {Math.abs(vegChange).toFixed(1)} ({vegChangePercent}%)
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">株価: {vegPrice}pt</div>
                    <div className="text-sm">
                      保有: {vegShares}株 ({vegValue.toLocaleString()}pt)
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setBuyType("vegetable")
                        setShowBuyDialog(true)
                      }}
                      className="bg-green-50 hover:bg-green-100"
                    >
                      購入
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sellShares("vegetable", vegShares)}
                      disabled={vegShares <= 0}
                      className="bg-green-50 hover:bg-green-100"
                    >
                      売却
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* アクティブな予測 */}
          {activePredictions.length > 0 && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">アクティブな予測</h3>
                <div className="space-y-2">
                  {activePredictions.map((pred, index) => {
                    let typeName = ""
                    switch (pred.type) {
                      case "temperature":
                        typeName = "気温"
                        break
                      case "sunshine":
                        typeName = "日照量"
                        break
                      case "precipitation":
                        typeName = "降水量"
                        break
                      case "vegetable":
                        typeName = "野菜価格"
                        break
                    }
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900 rounded"
                      >
                        <div>
                          {typeName}が{pred.prediction === "up" ? "上昇" : "下降"}すると予測
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">{pred.amount}pt</span>
                          <span className="text-sm text-muted-foreground">
                            あと{pred.expiresAt - currentStep}ターン
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* アクションボタン */}
          <div className="flex justify-between mb-4">
            <div className="space-x-2">
              <Button
                onClick={() => {
                  setPredictionType("temperature")
                  setShowPredictionDialog(true)
                }}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                予測する
              </Button>
            </div>
            <div>
              <Button onClick={advanceTurn} className="bg-green-500 hover:bg-green-600 text-white">
                次のターンへ
              </Button>
            </div>
          </div>

          {/* 購入ダイアログ */}
          {showBuyDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-4">株の購入</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">
                        {buyType === "temperature"
                          ? "気温株"
                          : buyType === "sunshine"
                            ? "日照株"
                            : buyType === "precipitation"
                              ? "降水量株"
                              : "野菜株"}
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        現在価格:{" "}
                        {buyType === "temperature"
                          ? tempPrice
                          : buyType === "sunshine"
                            ? sunshinePrice
                            : buyType === "precipitation"
                              ? precipPrice
                              : vegPrice}
                        pt
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">購入数量</label>
                      <input
                        type="number"
                        min="1"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        合計金額:{" "}
                        {(buyType === "temperature"
                          ? tempPrice
                          : buyType === "sunshine"
                            ? sunshinePrice
                            : buyType === "precipitation"
                              ? precipPrice
                              : vegPrice) * buyAmount}
                        pt
                      </div>
                      <div className="text-sm text-muted-foreground">所持金: {funds}pt</div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowBuyDialog(false)}>
                        キャンセル
                      </Button>
                      <Button onClick={buyShares} className="bg-green-500 hover:bg-green-600 text-white">
                        購入
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 予測ダイアログ */}
          {showPredictionDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-4">気象予測</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">予測する項目</label>
                      <select
                        value={predictionType}
                        onChange={(e) => setPredictionType(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="temperature">気温</option>
                        <option value="sunshine">日照量</option>
                        <option value="precipitation">降水量</option>
                        <option value="vegetable">野菜価格</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">予測</label>
                      <div className="flex space-x-2">
                        <Button
                          variant={prediction === "up" ? "default" : "outline"}
                          className={`flex-1 ${prediction === "up" ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                          onClick={() => setPrediction("up")}
                        >
                          上昇
                        </Button>
                        <Button
                          variant={prediction === "down" ? "default" : "outline"}
                          className={`flex-1 ${prediction === "down" ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                          onClick={() => setPrediction("down")}
                        >
                          下降
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">賭け金</label>
                      <input
                        type="number"
                        min="100"
                        step="100"
                        value={predictionAmount}
                        onChange={(e) => setPredictionAmount(Math.max(100, Number.parseInt(e.target.value) || 100))}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">所持金: {funds}pt</div>
                      <div className="text-sm text-muted-foreground">予測成功時: +{predictionAmount}pt</div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowPredictionDialog(false)}>
                        キャンセル
                      </Button>
                      <Button onClick={makePrediction} className="bg-green-500 hover:bg-green-600 text-white">
                        予測する
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* チュートリアル */}
          {showTutorial && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <Card className="w-full max-w-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">気象投資ゲームへようこそ！</h2>
                  <div className="space-y-4">
                    <p>このゲームでは、気象データの変動を予測して株を売買し、資産を増やすことが目標です。</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>気温、日照量、降水量、野菜価格の4種類の株があります。</li>
                      <li>気象データの変動に応じて株価が変動します。</li>
                      <li>「予測する」ボタンで次のターンの変動を予測して賭けることもできます。</li>
                      <li>「次のターンへ」ボタンで時間を進めることができます。</li>
                    </ul>
                    <p>ゲームオーバーにならないように、慎重に投資判断を行いましょう！</p>
                    <Button
                      onClick={() => setShowTutorial(false)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      チュートリアルを閉じる
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ゲームオーバー画面 */}
          {gameOver && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-4">ゲームオーバー</h3>
                  <p className="mb-4">残念ながら、資金が底をつき、ゲームオーバーとなりました。</p>
                  <div className="flex justify-between">
                    <Button onClick={resetGame} className="bg-green-500 hover:bg-green-600 text-white">
                      リトライ
                    </Button>
                    <Button
                      onClick={() => setShowTitleScreen(true)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      タイトルへ戻る
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}



