import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const AttributionModel = () => {
  const data = [
    { channel: 'Email', firstTouch: 45, lastTouch: 38, linear: 42, timeDecay: 40 },
    { channel: 'LinkedIn', firstTouch: 28, lastTouch: 35, linear: 31, timeDecay: 33 },
    { channel: 'Call', firstTouch: 15, lastTouch: 18, linear: 17, timeDecay: 16 },
    { channel: 'SMS', firstTouch: 12, lastTouch: 9, linear: 10, timeDecay: 11 },
  ];

  const [model, setModel] = useState('linear');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attribution Modeling</CardTitle>
        <select
          value={model}
          onChange={e => setModel(e.target.value)}
          className="mt-2 px-3 py-2 border rounded-lg"
        >
          <option value="firstTouch">First Touch</option>
          <option value="lastTouch">Last Touch</option>
          <option value="linear">Linear</option>
          <option value="timeDecay">Time Decay</option>
        </select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="channel" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={model} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const CohortAnalysis = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Cohort</th>
                <th className="p-2">Week 1</th>
                <th className="p-2">Week 2</th>
                <th className="p-2">Week 3</th>
                <th className="p-2">Week 4</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">Dec 2024</td>
                <td className="p-2 text-center bg-green-100 dark:bg-green-900/30">100%</td>
                <td className="p-2 text-center bg-green-200 dark:bg-green-800/30">45%</td>
                <td className="p-2 text-center bg-yellow-100 dark:bg-yellow-900/30">28%</td>
                <td className="p-2 text-center bg-red-100 dark:bg-red-900/30">12%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export const PredictiveAnalytics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold mb-2">Next Month Prediction</h4>
            <div className="text-3xl font-bold text-blue-600">64 meetings</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">±8 meetings (87% confidence)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CustomReportBuilder = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Drag and drop metrics to build custom reports
        </p>
        <div className="grid grid-cols-3 gap-4">
          {['Reply Rate', 'Open Rate', 'Meetings', 'Pipeline', 'ROI', 'Conversion'].map(metric => (
            <div
              key={metric}
              className="p-3 border rounded-lg cursor-move hover:border-primary-500"
            >
              {metric}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const ROICalculator = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="total-spend" className="text-sm font-medium">
                Total Spend
              </label>
              <input
                id="total-spend"
                type="number"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                placeholder="10000"
              />
            </div>
            <div>
              <label htmlFor="revenue-generated" className="text-sm font-medium">
                Revenue Generated
              </label>
              <input
                id="revenue-generated"
                type="number"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                placeholder="45000"
              />
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <div className="text-4xl font-bold text-green-600">350%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Return on Investment</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
