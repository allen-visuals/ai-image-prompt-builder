import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Copy, RefreshCw, Sparkles, Check, Settings2 } from 'lucide-react';
import { OPTIONS, DEFAULT_STATE } from './constants';

const Accordion = ({ title, isOpen, onToggle, children }) => (
  <div className="border border-zinc-800 rounded-lg mb-4 overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center p-4 bg-zinc-900 hover:bg-zinc-800 transition-colors"
    >
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-neon-blue" />
        {title}
      </h3>
      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </button>
    {isOpen && <div className="p-4">{children}</div>}
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-zinc-400 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-neon-purple transition-all appearance-none cursor-pointer"
    >
      <option value="">None / Default</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const FStopSlider = ({ label, value, onChange }) => (
  <div className="mb-4 col-span-1 sm:col-span-2 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
    <div className="flex justify-between items-end mb-1">
      <label className="block text-sm font-medium text-zinc-400">{label}</label>
      <span className="text-neon-blue font-semibold text-sm bg-neon-blue/10 px-2 py-1 rounded">
        {OPTIONS.fStops[value]}
      </span>
    </div>
    <p className="text-xs text-zinc-500 mb-3 italic">
      Lower numbers create a blurry background (shallow depth of field). Higher numbers keep everything in focus.
    </p>
    <input
      type="range"
      min="0"
      max={OPTIONS.fStops.length - 1}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
    />
    <div className="flex justify-between text-xs text-zinc-500 mt-2 px-1">
      <span>{OPTIONS.fStops[1]}</span>
      <span>{OPTIONS.fStops[OPTIONS.fStops.length - 1]}</span>
    </div>
  </div>
);

const TextArea = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-zinc-400 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-neon-purple transition-all"
    />
  </div>
);

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [openSections, setOpenSections] = useState({ technical: true, subject: false, supportingSubject: false, overrides: false });
  const [flavor, setFlavor] = useState('standard');
  const [copied, setCopied] = useState(false);

  const toggleSection = (sec) => setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  const updateField = (field, value) => setState((prev) => ({ ...prev, [field]: value }));
  const resetForm = () => setState(DEFAULT_STATE);

  const generatePrompt = useMemo(() => {
    // Collect components in logical order
    const parts = [];
    
    // Medium
    if (state.medium) parts.push(state.medium);
    // Subject definition
    const subjectParts = [state.gender, state.race, state.ethnicity, state.age, state.build, state.subjectType, state.expression].filter(Boolean);
    if (subjectParts.length > 0) parts.push(subjectParts.join(' '));
    // Supporting Subject definition
    const supportingSubjectParts = [state.supportingGender, state.supportingRace, state.supportingEthnicity, state.supportingAge, state.supportingBuild, state.supportingSubjectType, state.supportingExpression].filter(Boolean);
    if (supportingSubjectParts.length > 0) parts.push(`accompanied by a ${supportingSubjectParts.join(' ')}`);
    // Overrides: Action & Wardrobe
    if (state.coreAction) parts.push(state.coreAction);
    if (state.wardrobe) parts.push(`wearing ${state.wardrobe}`);
    // Environment/Background
    if (state.background) parts.push(state.background);
    // Technical
    if (state.framing) parts.push(state.framing);
    if (state.lens) parts.push(state.lens);
    if (state.lensType) parts.push(state.lensType);
    if (state.fStopIndex > 0) parts.push(OPTIONS.fStops[state.fStopIndex]);
    if (state.lighting) parts.push(state.lighting);
    if (state.colorGrading) parts.push(state.colorGrading);
    
    let compiled = parts.join(', ');

    if (flavor === 'midjourney' && state.aspectRatio) {
      compiled += ` --ar ${state.aspectRatio}`;
    } else if (flavor !== 'midjourney' && state.aspectRatio) {
      compiled += `, aspect ratio ${state.aspectRatio}`;
    }

    return compiled;
  }, [state, flavor]);

  const handleCopy = () => {
    let textToCopy = generatePrompt;
    if (flavor === 'stablediffusion' && state.negativePrompt) {
      textToCopy += `\n\nNegative Prompt: ${state.negativePrompt}`;
    } else if (flavor !== 'stablediffusion' && state.negativePrompt) {
      // In standard/MJ we might just append it or exclude it depending on user intent, 
      // but let's append it with a clear marker if they typed one.
      textToCopy += ` --no ${state.negativePrompt}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans">
      
      {/* LEFT PANEL - Form */}
      <div className="w-full md:w-1/2 lg:w-5/12 h-screen overflow-y-auto border-r border-zinc-800 p-6 xl:p-10 custom-scrollbar">
        <header className="mb-8 flex flex-col items-start">
          <img src="/logo.png" alt="AI Image Prompt Builder by allenvisuals" className="w-full max-w-xs sm:max-w-md h-auto" />
          <p className="text-zinc-400 mt-4">Craft precise AI image generations.</p>
        </header>

        <Accordion title="Technical Parameters" isOpen={openSections.technical} onToggle={() => toggleSection('technical')}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 items-start">
            <Select label="Medium" value={state.medium} onChange={(v) => updateField('medium', v)} options={OPTIONS.medium} />
            <Select label="Framing" value={state.framing} onChange={(v) => updateField('framing', v)} options={OPTIONS.framing} />
            <Select label="Lens" value={state.lens} onChange={(v) => updateField('lens', v)} options={OPTIONS.lens} />
            <Select label="Lens Type" value={state.lensType} onChange={(v) => updateField('lensType', v)} options={OPTIONS.lensType} />
            <FStopSlider label="F-Stop (Depth of Field)" value={state.fStopIndex} onChange={(v) => updateField('fStopIndex', v)} />
            <Select label="Lighting" value={state.lighting} onChange={(v) => updateField('lighting', v)} options={OPTIONS.lighting} />
            <Select label="Color Grading" value={state.colorGrading} onChange={(v) => updateField('colorGrading', v)} options={OPTIONS.colorGrading} />
            <Select label="Aspect Ratio" value={state.aspectRatio} onChange={(v) => updateField('aspectRatio', v)} options={OPTIONS.aspectRatio} />
          </div>
        </Accordion>

        <Accordion title="Main Subject Definition" isOpen={openSections.subject} onToggle={() => toggleSection('subject')}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Select label="Subject Type" value={state.subjectType} onChange={(v) => updateField('subjectType', v)} options={OPTIONS.subjectType} />
            <Select label="Gender" value={state.gender} onChange={(v) => updateField('gender', v)} options={OPTIONS.gender} />
            <Select label="Race" value={state.race} onChange={(v) => updateField('race', v)} options={OPTIONS.race} />
            <Select label="Ethnicity" value={state.ethnicity} onChange={(v) => updateField('ethnicity', v)} options={OPTIONS.ethnicity} />
            <Select label="Age" value={state.age} onChange={(v) => updateField('age', v)} options={OPTIONS.age} />
            <Select label="Build" value={state.build} onChange={(v) => updateField('build', v)} options={OPTIONS.build} />
            <Select label="Expression" value={state.expression} onChange={(v) => updateField('expression', v)} options={OPTIONS.expression} />
          </div>
        </Accordion>

        <Accordion title="Supporting Subject Definition" isOpen={openSections.supportingSubject} onToggle={() => toggleSection('supportingSubject')}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Select label="Subject Type" value={state.supportingSubjectType} onChange={(v) => updateField('supportingSubjectType', v)} options={OPTIONS.subjectType} />
            <Select label="Gender" value={state.supportingGender} onChange={(v) => updateField('supportingGender', v)} options={OPTIONS.gender} />
            <Select label="Race" value={state.supportingRace} onChange={(v) => updateField('supportingRace', v)} options={OPTIONS.race} />
            <Select label="Ethnicity" value={state.supportingEthnicity} onChange={(v) => updateField('supportingEthnicity', v)} options={OPTIONS.ethnicity} />
            <Select label="Age" value={state.supportingAge} onChange={(v) => updateField('supportingAge', v)} options={OPTIONS.age} />
            <Select label="Build" value={state.supportingBuild} onChange={(v) => updateField('supportingBuild', v)} options={OPTIONS.build} />
            <Select label="Expression" value={state.supportingExpression} onChange={(v) => updateField('supportingExpression', v)} options={OPTIONS.expression} />
          </div>
        </Accordion>

        <Accordion title="Custom Overrides" isOpen={openSections.overrides} onToggle={() => toggleSection('overrides')}>
          <TextArea label="Core Action / Pose" value={state.coreAction} onChange={(v) => updateField('coreAction', v)} placeholder="e.g. sitting on a bench reading a futuristic glowing book..." />
          <TextArea label="Wardrobe" value={state.wardrobe} onChange={(v) => updateField('wardrobe', v)} placeholder="e.g. detailed cyberpunk jacket with neon accents..." />
          <TextArea label="Background / Environment" value={state.background} onChange={(v) => updateField('background', v)} placeholder="e.g. bustling Tokyo street at night, rain puddles reflecting neon..." />
          <TextArea label="Negative Prompt" value={state.negativePrompt} onChange={(v) => updateField('negativePrompt', v)} placeholder="e.g. ugly, deformed, blurry, low resolution..." />
        </Accordion>

        <button 
          onClick={resetForm}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 py-3 rounded-lg transition-colors font-medium"
        >
          <RefreshCw className="w-5 h-5" />
          Reset Form
        </button>
      </div>

      {/* RIGHT PANEL - Output */}
      <div className="w-full md:w-1/2 lg:w-7/12 h-screen sticky top-0 p-6 xl:p-10 flex flex-col bg-zinc-950/80 backdrop-blur-md">
        
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-semibold text-zinc-100">Live Output</h2>
          <div className="flex flex-col items-end">
            <label className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Format Flavor</label>
            <select 
              value={flavor} 
              onChange={(e) => setFlavor(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm rounded-md p-1.5 focus:outline-none focus:border-neon-blue transition-colors"
            >
              <option value="standard">Standard (Comma Separated)</option>
              <option value="midjourney">Midjourney Style</option>
              <option value="stablediffusion">Stable Diffusion Style</option>
            </select>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative group overflow-y-auto custom-scrollbar">
            {generatePrompt ? (
              <p className="text-xl leading-relaxed text-zinc-200 font-light tracking-wide">{generatePrompt}</p>
            ) : (
              <p className="text-xl leading-relaxed text-zinc-600 font-light italic">Start selecting parameters to build your prompt...</p>
            )}
          </div>

          {flavor === 'stablediffusion' && (
            <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-y-auto custom-scrollbar flex flex-col">
              <span className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-2">Negative Prompt</span>
              <p className="text-zinc-400 leading-relaxed font-light">
                {state.negativePrompt || <span className="italic opacity-50">No negative prompt defined...</span>}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button 
            onClick={handleCopy}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-300 ${
              copied 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30 hover:bg-neon-blue/20 hover:border-neon-blue/60 shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-6 h-6" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-6 h-6" />
                Copy Prompt
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
