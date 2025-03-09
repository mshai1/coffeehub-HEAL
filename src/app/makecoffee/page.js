'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';

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
    const [requiredIngredients, setRequiredIngredients] = useState({});
    const [showWelcomePopup, setShowWelcomePopup] = useState(true);
    const [showMissingPopup, setShowMissingPopup] = useState(false);
    const [showMakingCoffeePopup, setShowMakingCoffeePopup] = useState(false);
    const [missingItems, setMissingItems] = useState({});
    const [insufficientItem, setInsufficientItem] = useState('');
    const router = useRouter();

    useEffect(() => {
        const required = {
            Coffee: Math.floor(Math.random() * 3) + 1,
            Milk: Math.floor(Math.random() * 3) + 1,
            Sugar: Math.floor(Math.random() * 3) + 1,
            Cream: Math.floor(Math.random() * 3) + 1,
            Water: Math.floor(Math.random() * 3) + 1
        };
        setRequiredIngredients(required);
        const insufficient = ingredients[Math.floor(Math.random() * ingredients.length)];
        setAvailableIngredients(prev => ({ ...prev, [insufficient]: 0 }));
        setInsufficientItem(insufficient);
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
        const missing = {};
        Object.keys(requiredIngredients).forEach(item => {
            if (!coffeeIngredients[item] || coffeeIngredients[item] < requiredIngredients[item]) {
                missing[item] = requiredIngredients[item] - (coffeeIngredients[item] || 0);
            }
        });
        setMissingItems(missing);
        setShowMissingPopup(Object.keys(missing).length > 0);
    };

    const refillIngredient = (ingredient) => {
        setAvailableIngredients(prev => ({ ...prev, [ingredient]: prev[ingredient] + 3 }));
    };

    const completeCoffee = () => {
        checkMissingItems();
        if (Object.keys(missingItems).length === 0) {
            setShowMakingCoffeePopup(true);
        }
    };

    return (
        <div className="min-h-screen bg-brown-900 text-white p-8">
            <div className="flex justify-start">
                <Image src="/cafe-logo.png" alt="CoffeeHub Logo" width={150} height={50} />
            </div>
            <h1 className="text-3xl font-bold">CoffeeHub</h1>
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
                className="mt-4 bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
                onClick={checkMissingItems}
            >
                Check Missing Items
            </button>
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

            <Dialog open={showWelcomePopup} onClose={() => setShowWelcomePopup(false)}>
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md text-black">
                        <p>A visually impaired customer needs your help to make a coffee. They require:</p>
                        <ul>
                            {Object.keys(requiredIngredients).map(item => (
                                <li key={item}>{item}: {requiredIngredients[item]}</li>
                            ))}
                        </ul>
                        <button onClick={() => setShowWelcomePopup(false)} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md">OK</button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={showMissingPopup} onClose={() => setShowMissingPopup(false)}>
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md text-black">
                        <p>The coffee is missing:</p>
                        <ul>
                            {Object.keys(missingItems).map(item => (
                                <li key={item}>{item}: {missingItems[item]}</li>
                            ))}
                        </ul>
                        <button onClick={() => setShowMissingPopup(false)} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md">OK</button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={showMakingCoffeePopup} onClose={() => setShowMakingCoffeePopup(false)}>
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md text-black">
                        <p>Making your coffee... ☕</p>
                        <button onClick={() => router.push('/')} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md">Done</button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
