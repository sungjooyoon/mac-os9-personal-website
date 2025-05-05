"use client"

import { useState } from 'react';
import { MacWindow } from '@/components/MacWindow';
import { useAppContext } from '@/context/AppContext';

interface CalculatorProps {
  id: string;
  name: string;
  position: { x: number; y: number };
  zIndex: number;
}

export function Calculator({ id, name, position, zIndex }: CalculatorProps) {
  const { bringToFront } = useAppContext();
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [newInput, setNewInput] = useState(true);
  
  const handleDigit = (digit: string) => {
    if (display === '0' || newInput) {
      setDisplay(digit);
      setNewInput(false);
    } else {
      setDisplay(display + digit);
    }
  };
  
  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);
    
    if (prevValue !== null && operation) {
      let result = 0;
      switch (operation) {
        case '+': result = prevValue + currentValue; break;
        case '-': result = prevValue - currentValue; break;
        case '*': result = prevValue * currentValue; break;
        case '/': result = prevValue / currentValue; break;
      }
      
      setDisplay(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(currentValue);
    }
    
    setOperation(op);
    setNewInput(true);
  };
  
  const handleEquals = () => {
    if (prevValue === null || operation === null) return;
    
    const currentValue = parseFloat(display);
    let result = 0;
    
    switch (operation) {
      case '+': result = prevValue + currentValue; break;
      case '-': result = prevValue - currentValue; break;
      case '*': result = prevValue * currentValue; break;
      case '/': result = prevValue / currentValue; break;
    }
    
    setDisplay(String(result));
    setPrevValue(null);
    setOperation(null);
    setNewInput(true);
  };
  
  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setNewInput(true);
  };
  
  return (
    <MacWindow
      title="Calculator"
      width="w-[180px]"
      height="h-[240px]"
      defaultPosition={position}
      zIndex={zIndex}
      onFocus={() => bringToFront(id)}
      id={id}
      minWidth={180}
      minHeight={240}
    >
      <div className="p-2 bg-gray-200 flex flex-col h-full">
        <div className="calculator-display">{display}</div>
        
        <div className="grid grid-cols-4 gap-1 mt-2">
          <button className="calculator-button" onClick={() => handleClear()}>C</button>
          <button className="calculator-button" onClick={() => handleOperation('/')}>/</button>
          <button className="calculator-button" onClick={() => handleOperation('*')}>*</button>
          <button className="calculator-button" onClick={() => setDisplay(String(parseFloat(display) * -1))}>+/-</button>
          
          <button className="calculator-button" onClick={() => handleDigit('7')}>7</button>
          <button className="calculator-button" onClick={() => handleDigit('8')}>8</button>
          <button className="calculator-button" onClick={() => handleDigit('9')}>9</button>
          <button className="calculator-button" onClick={() => handleOperation('-')}>-</button>
          
          <button className="calculator-button" onClick={() => handleDigit('4')}>4</button>
          <button className="calculator-button" onClick={() => handleDigit('5')}>5</button>
          <button className="calculator-button" onClick={() => handleDigit('6')}>6</button>
          <button className="calculator-button" onClick={() => handleOperation('+')}>+</button>
          
          <button className="calculator-button" onClick={() => handleDigit('1')}>1</button>
          <button className="calculator-button" onClick={() => handleDigit('2')}>2</button>
          <button className="calculator-button" onClick={() => handleDigit('3')}>3</button>
          <button 
            className="calculator-button row-span-2" 
            style={{ height: 'auto' }}
            onClick={() => handleEquals()}
          >=</button>
          
          <button 
            className="calculator-button col-span-2" 
            onClick={() => handleDigit('0')}
          >0</button>
          <button className="calculator-button" onClick={() => {
            if (!display.includes('.')) handleDigit('.');
          }}>.</button>
        </div>
      </div>
    </MacWindow>
  );
} 