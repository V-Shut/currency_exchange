import { useEffect, useState } from "react";
import "./App.css";

type Currency = {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
};

function App() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [leftInput, setLeftInput] = useState<number | string>(0);
  const [rightInput, setRightInput] = useState<number | string>(0);
  const [leftSelect, setLeftSelect] = useState<Currency | null>(null);
  const [rightSelect, setRightSelect] = useState<Currency | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      data.push({
        r030: 0,
        txt: "Українська гривня",
        rate: 1,
        cc: "UAH",
        exchangedate: data[0].exchangedate,
      });
      data.sort((a: Currency, b: Currency) => a.txt.localeCompare(b.txt));
      setCurrencies(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleLeftSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = currencies.find(
      (currency) => currency.cc === event.target.value
    );
    if (selectedCurrency) {
      setLeftSelect(selectedCurrency);
    }
  };

  const handleRightSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = currencies.find(
      (currency) => currency.cc === event.target.value
    );
    if (selectedCurrency) {
      setRightSelect(selectedCurrency);
    }
  };

  useEffect(() => {
    setLeftInput(0);
  }, [leftSelect, rightSelect]);

  useEffect(() => {
    if (leftSelect && rightSelect) {
      const calculatedValue = (Number(leftInput) * leftSelect.rate) / rightSelect.rate;
      if (calculatedValue !== Number(rightInput)) {
        setRightInput(Math.round(calculatedValue));
      }
    }
  }, [leftInput]);

  useEffect(() => {
    if (leftSelect && rightSelect) {
      const calculatedValue = (Number(rightInput) * rightSelect.rate) / leftSelect.rate;
      if (calculatedValue !== Number(leftInput)) {
        setLeftInput(Math.round(calculatedValue));
      }
    }
  }, [rightInput]);

  useEffect(() => {
    setLeftSelect(currencies[0]);
    setRightSelect(currencies[0]);
  }, [currencies]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="curr_container">
        <input
          className="curr_input"
          type="text"
          value={leftInput}
          onChange={(event) => setLeftInput(event.target.value)}
        />
        <select
          className="curr_select"
          name="left select"
          onChange={handleLeftSelect}
          value={leftSelect?.cc || ""}
        >
          {currencies.map((el) => (
            <option key={el.cc} value={el.cc}>
              {el.txt}, {el.cc}
            </option>
          ))}
        </select>
      </div>
      <h1 className="correlation">{leftSelect && rightSelect ? `1 = ${Math.round(leftSelect.rate / rightSelect.rate * 100) / 100}` : ''}</h1>
      <div className="curr_container">
        <input
          className="curr_input"
          type="text"
          value={rightInput}
          onChange={(event) => setRightInput(event.target.value)}
        />
        <select
          className="curr_select"
          name="right select"
          onChange={handleRightSelect}
          value={rightSelect?.cc || ""}
        >
          {currencies.map((el) => (
            <option key={el.cc} value={el.cc}>
              {el.txt}, {el.cc}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default App;
