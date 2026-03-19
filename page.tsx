'use client';

import { useState } from 'react';
import { AlertTriangle, Activity, Droplets, Microscope, BookOpen } from 'lucide-react';
import { 
  analyzeCBC, 
  analyzeAnemia, 
  analyzeFlowCytometry, 
  analyzePancytopenia,
  type AnalysisResult,
  type DiagnosisResult 
} from '@/lib/hemewise-engine';

type TabType = 'cbc' | 'anemia' | 'pancyto' | 'flow' | 'quick';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('cbc');
  const [results, setResults] = useState<AnalysisResult | null>(null);

  // CBC State
  const [cbcValues, setCbcValues] = useState({
    hemoglobin: '',
    wbc: '',
    platelet: '',
    mcv: '',
    rdw: '',
    reticulocytes: ''
  });

  // Anemia State
  const [anemiaValues, setAnemiaValues] = useState({
    hemoglobin: '',
    mcv: '',
    ferritin: '',
    iron: '',
    tibc: '',
    transferrinSat: '',
    b12: '',
    folate: ''
  });

  // Pancytopenia State
  const [pancytoValues, setPancytoValues] = useState({
    hemoglobin: '',
    wbc: '',
    platelet: '',
    reticulocytes: '',
    splenomegaly: false,
    blastsOnSmear: false,
    ldhElevated: false
  });

  // Flow Cytometry State
  const [flowMarkers, setFlowMarkers] = useState({
    CD34: '',
    CD117: '',
    HLADR: '',
    MPO: '',
    CD13: '',
    CD33: '',
    CD19: '',
    CD10: '',
    CD3: '',
    TdT: '',
    CD5: '',
    CD23: ''
  });
  const [blastPct, setBlastPct] = useState('');

  const handleCBCAnalysis = () => {
    const result = analyzeCBC({
      hemoglobin: cbcValues.hemoglobin ? parseFloat(cbcValues.hemoglobin) : undefined,
      wbc: cbcValues.wbc ? parseFloat(cbcValues.wbc) : undefined,
      platelet: cbcValues.platelet ? parseFloat(cbcValues.platelet) : undefined,
      mcv: cbcValues.mcv ? parseFloat(cbcValues.mcv) : undefined,
      rdw: cbcValues.rdw ? parseFloat(cbcValues.rdw) : undefined,
      reticulocytes: cbcValues.reticulocytes ? parseFloat(cbcValues.reticulocytes) : undefined,
    });
    setResults(result);
  };

  const handleAnemiaAnalysis = () => {
    const result = analyzeAnemia({
      hemoglobin: anemiaValues.hemoglobin ? parseFloat(anemiaValues.hemoglobin) : undefined,
      mcv: anemiaValues.mcv ? parseFloat(anemiaValues.mcv) : undefined,
      ferritin: anemiaValues.ferritin ? parseFloat(anemiaValues.ferritin) : undefined,
      iron: anemiaValues.iron ? parseFloat(anemiaValues.iron) : undefined,
      tibc: anemiaValues.tibc ? parseFloat(anemiaValues.tibc) : undefined,
      transferrinSat: anemiaValues.transferrinSat ? parseFloat(anemiaValues.transferrinSat) : undefined,
      b12: anemiaValues.b12 ? parseFloat(anemiaValues.b12) : undefined,
      folate: anemiaValues.folate ? parseFloat(anemiaValues.folate) : undefined,
    });
    setResults(result);
  };

  const handlePancytoAnalysis = () => {
    const result = analyzePancytopenia({
      hemoglobin: pancytoValues.hemoglobin ? parseFloat(pancytoValues.hemoglobin) : undefined,
      wbc: pancytoValues.wbc ? parseFloat(pancytoValues.wbc) : undefined,
      platelet: pancytoValues.platelet ? parseFloat(pancytoValues.platelet) : undefined,
      reticulocytes: pancytoValues.reticulocytes ? parseFloat(pancytoValues.reticulocytes) : undefined,
      splenomegaly: pancytoValues.splenomegaly,
      blastsOnSmear: pancytoValues.blastsOnSmear,
      ldhElevated: pancytoValues.ldhElevated,
    });
    setResults(result);
  };

  const handleFlowAnalysis = () => {
    const result = analyzeFlowCytometry(
      flowMarkers,
      blastPct ? parseFloat(blastPct) : undefined
    );
    setResults(result);
  };

  const renderResults = () => {
    if (!results) return null;

    const renderItem = (item: DiagnosisResult, index: number) => {
      const baseClass = "p-4 rounded-lg border-l-4 mb-3";
      const typeClass = {
        critical: "bg-red-500/10 border-red-500",
        warning: "bg-yellow-500/10 border-yellow-500",
        success: "bg-green-500/10 border-green-500",
        info: "bg-blue-500/10 border-blue-500"
      }[item.type];

      return (
        <div key={index} className={`${baseClass} ${typeClass}`}>
          <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">{item.label}</div>
          <div className="font-semibold">{item.value}</div>
          {item.action && (
            <div className="mt-2 text-sm text-yellow-400">→ {item.action}</div>
          )}
        </div>
      );
    };

    return (
      <div className="mt-6 space-y-4">
        {results.alerts.length > 0 && (
          <div>
            <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle size={18} /> Critical Alerts
            </h3>
            {results.alerts.map(renderItem)}
          </div>
        )}
        {results.findings.length > 0 && (
          <div>
            <h3 className="text-blue-400 font-semibold mb-2">Findings</h3>
            {results.findings.map(renderItem)}
          </div>
        )}
        {results.recommendations.length > 0 && (
          <div>
            <h3 className="text-green-400 font-semibold mb-2">Recommendations</h3>
            {results.recommendations.map(renderItem)}
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'cbc' as TabType, label: 'CBC Analyzer', icon: Activity },
    { id: 'anemia' as TabType, label: 'Anemia Workup', icon: Droplets },
    { id: 'pancyto' as TabType, label: 'Pancytopenia', icon: AlertTriangle },
    { id: 'flow' as TabType, label: 'Flow Cytometry', icon: Microscope },
    { id: 'quick' as TabType, label: 'Quick Reference', icon: BookOpen },
  ];

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            🩸 HemeWise Pro
          </h1>
          <p className="text-gray-400 mt-2">Hematology Diagnostic Decision Support</p>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResults(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${activeTab === tab.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-[#1a2234] text-gray-400 hover:text-white hover:border-blue-500 border border-[#2d3a4f]'
                }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CBC Panel */}
        {activeTab === 'cbc' && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">📊 Enter CBC Values</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hemoglobin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 12.5"
                  className="input-field"
                  value={cbcValues.hemoglobin}
                  onChange={e => setCbcValues({...cbcValues, hemoglobin: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">WBC (×10⁹/L)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 7.5"
                  className="input-field"
                  value={cbcValues.wbc}
                  onChange={e => setCbcValues({...cbcValues, wbc: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Platelets (×10⁹/L)</label>
                <input
                  type="number"
                  step="1"
                  placeholder="e.g., 250"
                  className="input-field"
                  value={cbcValues.platelet}
                  onChange={e => setCbcValues({...cbcValues, platelet: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">MCV (fL)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 85"
                  className="input-field"
                  value={cbcValues.mcv}
                  onChange={e => setCbcValues({...cbcValues, mcv: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">RDW (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 13"
                  className="input-field"
                  value={cbcValues.rdw}
                  onChange={e => setCbcValues({...cbcValues, rdw: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Reticulocytes (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 1.5"
                  className="input-field"
                  value={cbcValues.reticulocytes}
                  onChange={e => setCbcValues({...cbcValues, reticulocytes: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button onClick={handleCBCAnalysis} className="btn-primary">
                Analyze CBC
              </button>
            </div>
            {renderResults()}
          </div>
        )}

        {/* Anemia Panel */}
        {activeTab === 'anemia' && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">🔬 Iron Studies & Additional Labs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hemoglobin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 8.5"
                  className="input-field"
                  value={anemiaValues.hemoglobin}
                  onChange={e => setAnemiaValues({...anemiaValues, hemoglobin: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">MCV (fL)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 68"
                  className="input-field"
                  value={anemiaValues.mcv}
                  onChange={e => setAnemiaValues({...anemiaValues, mcv: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Ferritin (ng/mL)</label>
                <input
                  type="number"
                  step="1"
                  placeholder="e.g., 15"
                  className="input-field"
                  value={anemiaValues.ferritin}
                  onChange={e => setAnemiaValues({...anemiaValues, ferritin: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Transferrin Sat (%)</label>
                <input
                  type="number"
                  step="1"
                  placeholder="e.g., 15"
                  className="input-field"
                  value={anemiaValues.transferrinSat}
                  onChange={e => setAnemiaValues({...anemiaValues, transferrinSat: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">B12 (pg/mL)</label>
                <input
                  type="number"
                  step="1"
                  placeholder="e.g., 350"
                  className="input-field"
                  value={anemiaValues.b12}
                  onChange={e => setAnemiaValues({...anemiaValues, b12: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Folate (ng/mL)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 8"
                  className="input-field"
                  value={anemiaValues.folate}
                  onChange={e => setAnemiaValues({...anemiaValues, folate: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button onClick={handleAnemiaAnalysis} className="btn-primary">
                Analyze Anemia
              </button>
            </div>
            {renderResults()}
          </div>
        )}

        {/* Pancytopenia Panel */}
        {activeTab === 'pancyto' && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">⚠️ Pancytopenia Workup</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hemoglobin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 7.5"
                  className="input-field"
                  value={pancytoValues.hemoglobin}
                  onChange={e => setPancytoValues({...pancytoValues, hemoglobin: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">WBC (×10⁹/L)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 2.0"
                  className="input-field"
                  value={pancytoValues.wbc}
                  onChange={e => setPancytoValues({...pancytoValues, wbc: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Platelets (×10⁹/L)</label>
                <input
                  type="number"
                  step="1"
                  placeholder="e.g., 50"
                  className="input-field"
                  value={pancytoValues.platelet}
                  onChange={e => setPancytoValues({...pancytoValues, platelet: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Reticulocytes (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 0.5"
                  className="input-field"
                  value={pancytoValues.reticulocytes}
                  onChange={e => setPancytoValues({...pancytoValues, reticulocytes: e.target.value})}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pancytoValues.splenomegaly}
                  onChange={e => setPancytoValues({...pancytoValues, splenomegaly: e.target.checked})}
                  className="w-4 h-4"
                />
                <span>Splenomegaly</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pancytoValues.blastsOnSmear}
                  onChange={e => setPancytoValues({...pancytoValues, blastsOnSmear: e.target.checked})}
                  className="w-4 h-4"
                />
                <span>Blasts on Smear</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pancytoValues.ldhElevated}
                  onChange={e => setPancytoValues({...pancytoValues, ldhElevated: e.target.checked})}
                  className="w-4 h-4"
                />
                <span>LDH Elevated</span>
              </label>
            </div>
            <div className="mt-6 text-center">
              <button onClick={handlePancytoAnalysis} className="btn-primary">
                Run Algorithm
              </button>
            </div>
            {renderResults()}
          </div>
        )}

        {/* Flow Cytometry Panel */}
        {activeTab === 'flow' && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">🧬 Flow Cytometry Markers</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {Object.keys(flowMarkers).map(marker => (
                <div key={marker}>
                  <label className="block text-sm text-gray-400 mb-1">{marker}</label>
                  <select
                    className="input-field"
                    value={flowMarkers[marker as keyof typeof flowMarkers]}
                    onChange={e => setFlowMarkers({...flowMarkers, [marker]: e.target.value})}
                  >
                    <option value="">--</option>
                    <option value="+">Positive</option>
                    <option value="-">Negative</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-1">Blast % (if known)</label>
              <input
                type="number"
                step="1"
                placeholder="e.g., 45"
                className="input-field max-w-[200px]"
                value={blastPct}
                onChange={e => setBlastPct(e.target.value)}
              />
            </div>
            <div className="mt-6 text-center">
              <button onClick={handleFlowAnalysis} className="btn-primary">
                Classify
              </button>
            </div>
            {renderResults()}
          </div>
        )}

        {/* Quick Reference Panel */}
        {activeTab === 'quick' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">📚 Microcytic Anemia Differential</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2d3a4f]">
                      <th className="text-left py-2 text-gray-400">Condition</th>
                      <th className="text-left py-2 text-gray-400">Ferritin</th>
                      <th className="text-left py-2 text-gray-400">Iron</th>
                      <th className="text-left py-2 text-gray-400">TIBC</th>
                      <th className="text-left py-2 text-gray-400">RDW</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#2d3a4f]">
                      <td className="py-2 font-semibold">IDA</td>
                      <td>↓↓</td>
                      <td>↓</td>
                      <td>↑</td>
                      <td>↑↑</td>
                    </tr>
                    <tr className="border-b border-[#2d3a4f]">
                      <td className="py-2 font-semibold">Thalassemia Trait</td>
                      <td>N/↑</td>
                      <td>N</td>
                      <td>N</td>
                      <td>N</td>
                    </tr>
                    <tr className="border-b border-[#2d3a4f]">
                      <td className="py-2 font-semibold">ACD</td>
                      <td>N/↑</td>
                      <td>↓</td>
                      <td>↓</td>
                      <td>N</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">Sideroblastic</td>
                      <td>↑</td>
                      <td>↑</td>
                      <td>N</td>
                      <td>↑</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">🚨 Critical Alerts - ACT IMMEDIATELY</h2>
              <div className="space-y-3">
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="font-semibold text-red-400">Faggot cells / t(15;17) → APL</div>
                  <div className="text-sm text-gray-300">Action: START ATRA NOW</div>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="font-semibold text-red-400">ADAMTS13 &lt;10% + schistocytes → TTP</div>
                  <div className="text-sm text-gray-300">Action: URGENT PLASMAPHERESIS</div>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="font-semibold text-yellow-400">Ferritin &gt;10,000 + cytopenias → HLH</div>
                  <div className="text-sm text-gray-300">Action: Check HLH criteria</div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">🧬 Flow Cytometry Quick Patterns</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2d3a4f]">
                      <th className="text-left py-2 text-gray-400">Diagnosis</th>
                      <th className="text-left py-2 text-gray-400">Key Markers</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#2d3a4f]">
                      <td className="py-2 font-semibold">AML</td>
                      <td>CD34+, CD117+, CD13+, CD33+, MPO+</td>
                    </tr>
                    <tr className="border-b border-[#2d3a4f]">
                      <td className="py-2 font-semibold text-red-400">APL</td>
                      <td>CD34−, HLA-DR−, CD13+, CD33+</td>
                    </tr>
                    <tr className="border-b border-[#2d3a4f]">
                      <td className="py-2 font-semibold">B-ALL</td>
                      <td>CD19+, CD10+, CD34+, TdT+</td>
                    </tr>
                    <tr className="border-b border-[#2d3a4f]">
                      <td className="py-2 font-semibold">CLL</td>
                      <td>CD5+, CD23+, CD200+, weak CD20</td>
                    </tr>
                    <tr className="border-b border-[#2d3a4f]">
                      <td className="py-2 font-semibold">Hairy Cell</td>
                      <td>CD11c+, CD25+, CD103+ (triad)</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">Mantle Cell</td>
                      <td>CD5+, CD23−, Cyclin D1+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm border-t border-[#2d3a4f] pt-6">
          <p><strong>HemeWise Pro</strong> • Based on HemeWise by Dr. Sahrish Bari (2025)</p>
          <p className="mt-1">⚠️ For educational purposes only. Clinical decisions require physician evaluation.</p>
        </footer>
      </div>
    </main>
  );
}
