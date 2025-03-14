'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import style from '../globals.css';

const ingredients = ['Coffee', 'Milk', 'Sugar', 'Cream', 'Water'];

export default function MakeCoffee() {
    const [availableIngredients, setAvailableIngredients] = useState({
        Coffee: 2,
        Milk: 2,
        Sugar: 2,
        Cream: 2,
        Water: 2
    });
    const [coffeeIngredients, setCoffeeIngredients] = useState({});
    const [requiredIngredients, setRequiredIngredients] = useState(null);
    const [missingItems, setMissingItems] = useState({});
    const [insufficientItem, setInsufficientItem] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!requiredIngredients) {
            const required = {
                Coffee: Math.floor(Math.random() * 3) + 1,
                Milk: (Math.floor(Math.random() * 3) + 1) * 10,
                Sugar: Math.floor(Math.random() * 3) + 1,
                Cream: Math.floor(Math.random() * 3) + 1,
                Water: (Math.floor(Math.random() * 3) + 1) * 10
            };
            setRequiredIngredients(required);
            const insufficient = ingredients[Math.floor(Math.random() * ingredients.length)];
            setAvailableIngredients(prev => ({ ...prev, [insufficient]: 0 }));
            setInsufficientItem(insufficient);

            setTimeout(() => {
                const instructions = `A visually impaired customer needs your help to make a coffee. They require: ${Object.entries(required).map(([item, amount]) => {
                    const unit = item === 'Coffee' ? 'shots' : item === 'Sugar' ? 'packs' : item === 'Cream' ? 'pumps' : 'ml';
                    return `${amount} ${unit} of ${item.toLowerCase()}`;
                }).join(', ')}`;
                const utterance = new SpeechSynthesisUtterance(instructions);
                window.speechSynthesis.speak(utterance);
            }, 500);
        }
    }, []);

    const addIngredient = (ingredient) => {
        if (availableIngredients[ingredient] > 0) {
            setCoffeeIngredients(prev => {
                const updated = { ...prev, [ingredient]: (prev[ingredient] || 0) + 1 };
                return updated;
            });
            setAvailableIngredients(prev => ({ ...prev, [ingredient]: prev[ingredient] - 1 }));
        } else {
            alert(`${ingredient} is not enough. Please refill.`);
        }
    };

    const checkMissingItems = () => {
        if (!requiredIngredients) return;
        const missing = {};
        Object.keys(requiredIngredients).forEach(item => {
            if (!coffeeIngredients[item] || coffeeIngredients[item] < requiredIngredients[item]) {
                missing[item] = requiredIngredients[item] - (coffeeIngredients[item] || 0);
            }
        });
        setMissingItems(missing);
        if (Object.keys(missing).length > 0) {
            const missingText = `The coffee is missing: ${Object.entries(missing).map(([item, amount]) => {
                const unit = item === 'Coffee' ? 'shots' : item === 'Sugar' ? 'packs' : item === 'Cream' ? 'pumps' : 'ml';
                return `${amount} ${unit} of ${item.toLowerCase()}`;
            }).join(', ')}`;
            const utterance = new SpeechSynthesisUtterance(missingText);
            window.speechSynthesis.speak(utterance);
        }
    };

    const refillIngredient = (ingredient) => {
        setAvailableIngredients(prev => ({ ...prev, [ingredient]: prev[ingredient] + 3 }));
    };

    const completeCoffee = () => {
        checkMissingItems();
        if (Object.keys(missingItems).length === 0) {
            const utterance = new SpeechSynthesisUtterance("Making your coffee...");
            window.speechSynthesis.speak(utterance);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key.toLowerCase() === 'h') {
                checkMissingItems();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="min-h-screen bg-brown-900 text-white p-8">
            <div className="flex justify-start">
                <Image src="/cafe-logo.png" alt="CoffeeHub Logo" width={150} height={50} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
                {ingredients.map(item => (
                    <button 
                        key={item} 
                        className="bg-yellow-600 px-4 py-2 rounded-md hover:bg-yellow-700"
                        onClick={() => addIngredient(item)}
                    >
                        Add {item}
                    </button>
                ))}
            </div>
            <button 
                className="mt-4 ml-4 bg-green-600 px-4 py-2 rounded-md hover:bg-green-700"
                onClick={completeCoffee}
            >
                Complete Coffee
            </button>
            <div className="mt-6 grid grid-cols-2 gap-4">
                {ingredients.map(item => (
                    <button 
                        key={item} 
                        className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
                        onClick={() => refillIngredient(item)}
                    >
                        Refill {item}
                    </button>
                ))}
            </div>
        </div>
    );
}