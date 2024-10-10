import React, { useState } from 'react';
import { Search, Apple } from 'lucide-react';

interface NutrientInfo {
  label: string;
  quantity: number;
  unit: string;
}

interface NutritionData {
  calories: number;
  totalWeight: number;
  totalNutrients: {
    [key: string]: NutrientInfo;
  };
}

function App() {
  const [food, setFood] = useState('');
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNutritionData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=4cdb6c2b&app_key=ceba981784267437bea34246bb24b4b5&ingr=${encodeURIComponent(food)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setNutritionData(data);
    } catch (err) {
      setError('Error fetching nutrition data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-600 flex items-center justify-center">
          <Apple className="mr-2" /> Food Nutrient Analyzer
        </h1>
        <div className="flex mb-4">
          <input
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="Enter a food item (e.g., 100g apple)"
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={fetchNutritionData}
            disabled={loading}
            className="bg-green-500 text-white p-2 rounded-r-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
          >
            <Search className="mr-1" /> Analyze
          </button>
        </div>
        
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {nutritionData && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Nutrition Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="font-bold">Calories</p>
                <p>{nutritionData.calories.toFixed(2)} kcal</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="font-bold">Total Weight</p>
                <p>{nutritionData.totalWeight.toFixed(2)} g</p>
              </div>
              {Object.entries(nutritionData.totalNutrients).map(([key, nutrient]) => (
                <div key={key} className="bg-gray-100 p-4 rounded-md">
                  <p className="font-bold">{nutrient.label}</p>
                  <p>{nutrient.quantity.toFixed(2)} {nutrient.unit}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;