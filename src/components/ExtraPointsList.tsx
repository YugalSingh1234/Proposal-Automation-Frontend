import React from 'react';
import { Plus, Trash2, List } from 'lucide-react';

interface ExtraPointsListProps {
  points: string[];
  onPointsChange: (points: string[]) => void;
}

export const ExtraPointsList: React.FC<ExtraPointsListProps> = ({
  points,
  onPointsChange,
}) => {
  const addPoint = () => {
    onPointsChange([...points, '']);
  };

  const removePoint = (index: number) => {
    onPointsChange(points.filter((_, i) => i !== index));
  };

  const updatePoint = (index: number, value: string) => {
    const newPoints = [...points];
    newPoints[index] = value;
    onPointsChange(newPoints);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <List size={16} className="text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Extra Points</label>
        </div>
        <button
          type="button"
          onClick={addPoint}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <Plus size={14} />
          Add Point
        </button>
      </div>

      {points.length === 0 ? (
        <p className="text-sm text-gray-500 italic py-4">No extra points added</p>
      ) : (
        <div className="space-y-2">
          {points.map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => updatePoint(index, e.target.value)}
                  placeholder={`Extra point ${index + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => removePoint(index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove point"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};