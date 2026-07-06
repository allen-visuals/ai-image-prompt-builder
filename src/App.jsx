import { useState, useMemo } from 'react';
import Wheel from '@uiw/react-color-wheel';
import { hsvaToHex, hexToHsva } from '@uiw/color-convert';
import { ChevronDown, ChevronUp, Copy, RefreshCw, Check, Camera, User, Users, Image as ImageIcon, Wand2, Box } from 'lucide-react';
import { OPTIONS, DEFAULT_STATE } from './constants';

const Accordion = ({ title, icon: Icon, colorClass, isOpen, onToggle, children }) => (
  <div className="border border-zinc-800 rounded-lg mb-4 overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center p-4 bg-zinc-900 hover:bg-zinc-800 transition-colors"
    >
      <h3 className={`font-semibold text-lg flex items-center gap-3 ${colorClass || 'text-zinc-100'}`}>
        {Icon && <Icon className="w-5 h-5" />}
        {title}
      </h3>
      {isOpen ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
    </button>
    {isOpen && <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/30">{children}</div>}
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

const TextInput = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-zinc-400 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-neon-purple transition-all"
    />
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

const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 mb-4">
    <label className="text-sm font-medium text-zinc-300">{label}</label>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neon-purple focus:ring-offset-2 focus:ring-offset-zinc-950 ${
        checked ? 'bg-green-500' : 'bg-zinc-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const ColorPicker = ({ label, value, onChange }) => {
  let hsva = { h: 0, s: 0, v: 0, a: 1 };
  try {
    if (value) hsva = hexToHsva(value);
  } catch {
    // If invalid hex, fallback to black
  }

  return (
    <div className="mb-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex flex-col items-center sm:items-start gap-4">
      <div className="w-full flex justify-between items-center border-b border-zinc-800/50 pb-2">
        <label className="text-sm font-semibold text-zinc-300 tracking-wide uppercase">{label}</label>
        {value && (
          <button onClick={() => onChange('')} className="text-xs text-zinc-500 hover:text-zinc-300 uppercase tracking-wider font-semibold transition-colors">
            Clear
          </button>
        )}
      </div>
      
      <div className="w-full flex flex-col sm:flex-row items-center sm:items-center justify-around gap-6 py-2">
        <div className="flex shrink-0 drop-shadow-lg">
          <Wheel
            color={hsva}
            onChange={(color) => {
              const hex = hsvaToHex(color.hsva);
              onChange(hex);
            }}
            width={140}
            height={140}
          />
        </div>
        
        <div className="flex flex-col gap-3 w-full max-w-[200px]">
          <label className="text-xs text-zinc-500 uppercase tracking-widest text-center sm:text-left hidden sm:block">Selected Color</label>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full shadow-inner border border-zinc-700 shrink-0" style={{ backgroundColor: value || 'transparent' }}></div>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#HEX"
              className="bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-neon-purple transition-all text-center uppercase font-mono tracking-widest"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [openSections, setOpenSections] = useState({ technical: true, subject: false, supportingSubject: false, object: false, environment: false, overrides: false });
  const [flavor, setFlavor] = useState('standard');
  const [copied, setCopied] = useState(false);

  const toggleSection = (sec) => setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  const updateField = (field, value) => setState((prev) => ({ ...prev, [field]: value }));
  const resetForm = () => setState(DEFAULT_STATE);

  const generatePrompt = useMemo(() => {
    const formatDropdown = (label, value) => value ? `${label} is ${value}` : '';

    // Collect components in logical order
    const parts = [];
    
    // Medium
    if (state.medium) parts.push(formatDropdown('Medium', state.medium));
    
    // Subject definition
    const subjectParts = [
      formatDropdown('Gender', state.gender),
      formatDropdown('Race', state.race),
      formatDropdown('Ethnicity', state.ethnicity),
      formatDropdown('Skin Tone', state.skinTone),
      formatDropdown('Skin & Hand Texture', state.skinAndHandTexture),
      formatDropdown('Age', state.age),
      formatDropdown('Build', state.build),
      formatDropdown('Hair Texture', state.hairTexture),
      formatDropdown('Hair Style', state.hairStyle),
      formatDropdown('Hair Color', state.hairColor),
      formatDropdown('Lifestyle/Class', state.lifestyleClass),
      formatDropdown('Subject Type', state.subjectType),
      formatDropdown('Expression', state.expression),
      formatDropdown('Body Pose & Movement', state.bodyPoseAndMovement),
      state.clothingStyle,
      state.accessories,
      state.subjectCustom
    ].filter(Boolean);
    if (subjectParts.length > 0) {
      let str = subjectParts.join(', ');
      if (state.useReferenceSubject) str += ' (use reference given)';
      parts.push(str);
    } else if (state.useReferenceSubject) {
      parts.push('(use reference given)');
    }

    // Supporting Subject definition
    const supportingSubjectParts = [
      formatDropdown('Gender', state.supportingGender),
      formatDropdown('Race', state.supportingRace),
      formatDropdown('Ethnicity', state.supportingEthnicity),
      formatDropdown('Skin Tone', state.supportingSkinTone),
      formatDropdown('Skin & Hand Texture', state.supportingSkinAndHandTexture),
      formatDropdown('Age', state.supportingAge),
      formatDropdown('Build', state.supportingBuild),
      formatDropdown('Hair Texture', state.supportingHairTexture),
      formatDropdown('Hair Style', state.supportingHairStyle),
      formatDropdown('Hair Color', state.supportingHairColor),
      formatDropdown('Lifestyle/Class', state.supportingLifestyleClass),
      formatDropdown('Subject Type', state.supportingSubjectType),
      formatDropdown('Expression', state.supportingExpression),
      formatDropdown('Body Pose & Movement', state.supportingBodyPoseAndMovement),
      state.supportingClothingStyle,
      state.supportingAccessories,
      state.supportingSubjectCustom
    ].filter(Boolean);
    if (supportingSubjectParts.length > 0) {
      let str = `accompanied by: ${supportingSubjectParts.join(', ')}`;
      if (state.useReferenceSupportingSubject) str += ' (use reference given)';
      parts.push(str);
    } else if (state.useReferenceSupportingSubject) {
      parts.push('(use reference given)');
    }

    // Object / Product Subject definition
    const objectParts = [
      formatDropdown('Object Type', state.objectType),
      formatDropdown('Material', state.objectMaterial),
      formatDropdown('Condition', state.objectCondition),
      state.objectPrimaryColor ? `Primary Color is ${state.objectPrimaryColor}` : '',
      formatDropdown('Placement', state.objectPlacement),
      formatDropdown('Scale', state.objectScale),
      state.objectCustom
    ].filter(Boolean);
    if (objectParts.length > 0) {
      let str = `object subject: ${objectParts.join(', ')}`;
      if (state.useReferenceObject) str += ' (use reference given)';
      parts.push(str);
    } else if (state.useReferenceObject) {
      parts.push('(use reference given)');
    }

    // Overrides: Action & Wardrobe
    const overrideParts = [state.coreAction, state.wardrobe ? `wearing ${state.wardrobe}` : ''].filter(Boolean);
    if (overrideParts.length > 0) {
      let str = overrideParts.join(', ');
      if (state.useReferenceOverrides) str += ' (use reference given)';
      parts.push(str);
    } else if (state.useReferenceOverrides) {
      parts.push('(use reference given)');
    }

    // Environment/Background
    const envParts = [
      formatDropdown('Location Type', state.locationType),
      formatDropdown('Environment Lifestyle/Class', state.envLifestyleClass),
      formatDropdown('Location Space', state.locationSpace),
      state.exactLocation,
      formatDropdown('Time of Day', state.timeOfDay)
    ].filter(Boolean);
    let envStr = envParts.join(', ');
    if (state.environmentDescriptor) envStr += (envStr ? ', ' : '') + state.environmentDescriptor;
    if (state.coordinates) envStr += (envStr ? ', ' : '') + `Location Coordinates: ${state.coordinates}`;
    if (envStr) {
      if (state.useReferenceEnvironment) envStr += ' (use reference given)';
      parts.push(envStr);
    } else if (state.useReferenceEnvironment) {
      parts.push('(use reference given)');
    }

    // Technical (End)
    const techEndParts = [
      formatDropdown('Camera Shot Size', state.cameraShotSize),
      formatDropdown('Multi-Subject Framing', state.multiSubjectFraming),
      formatDropdown('Camera Angle', state.cameraAngle),
      formatDropdown('Lens Type', state.lensType),
      formatDropdown('Lens', state.lens),
      state.fStopIndex > 0 ? formatDropdown('F-Stop', OPTIONS.fStops[state.fStopIndex]) : '',
      formatDropdown('Lighting', state.lighting),
      formatDropdown('Color Grading', state.colorGrading),
      state.primaryBrandColor ? `Primary Brand Color is ${state.primaryBrandColor}` : '',
      state.secondaryBrandColor ? `Secondary Brand Color is ${state.secondaryBrandColor}` : '',
      state.technicalCustom
    ].filter(Boolean);
    if (techEndParts.length > 0) {
      let str = techEndParts.join(', ');
      if (state.useReferenceTechnical) str += ' (use reference given)';
      parts.push(str);
    } else if (state.useReferenceTechnical) {
      parts.push('(use reference given)');
    }
    
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
    <div className="h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans">
      
      {/* LEFT PANEL - Form */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex-1 overflow-y-auto border-r border-zinc-800 p-4 md:p-6 xl:p-10 custom-scrollbar">
        <header className="mb-6 md:mb-8 flex flex-col items-start">
          <img src="/logo.png" alt="AI Image Prompt Builder by allenvisuals" className="w-48 sm:w-full max-w-xs sm:max-w-md h-auto" />
          <p className="text-sm md:text-base text-zinc-400 mt-2 md:mt-4">Craft precise AI image generations.</p>
        </header>

        <Accordion title="Technical Parameters" icon={Camera} colorClass="text-blue-400" isOpen={openSections.technical} onToggle={() => toggleSection('technical')}>
          <ToggleSwitch label="Use Image Reference for Technical Parameters" checked={state.useReferenceTechnical} onChange={(v) => updateField('useReferenceTechnical', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 items-start">
            <Select label="Medium" value={state.medium} onChange={(v) => updateField('medium', v)} options={OPTIONS.medium} />
            <Select label="Camera Shot Size" value={state.cameraShotSize} onChange={(v) => updateField('cameraShotSize', v)} options={OPTIONS.cameraShotSize} />
            <Select label="Multi-Subject Framing" value={state.multiSubjectFraming} onChange={(v) => updateField('multiSubjectFraming', v)} options={OPTIONS.multiSubjectFraming} />
            <Select label="Camera Angle" value={state.cameraAngle} onChange={(v) => updateField('cameraAngle', v)} options={OPTIONS.cameraAngle} />
            <Select label="Lens Type" value={state.lensType} onChange={(v) => updateField('lensType', v)} options={OPTIONS.lensType} />
            <Select label="Lens" value={state.lens} onChange={(v) => updateField('lens', v)} options={OPTIONS.lens} />
            <FStopSlider label="F-Stop (Depth of Field)" value={state.fStopIndex} onChange={(v) => updateField('fStopIndex', v)} />
            <Select label="Lighting" value={state.lighting} onChange={(v) => updateField('lighting', v)} options={OPTIONS.lighting} />
            <Select label="Color Grading" value={state.colorGrading} onChange={(v) => updateField('colorGrading', v)} options={OPTIONS.colorGrading} />
            <Select label="Aspect Ratio" value={state.aspectRatio} onChange={(v) => updateField('aspectRatio', v)} options={OPTIONS.aspectRatio} />
          </div>
          <div className="flex flex-col mt-2">
            <ColorPicker label="Primary Brand Color" value={state.primaryBrandColor} onChange={(v) => updateField('primaryBrandColor', v)} />
            <ColorPicker label="Secondary Brand Color" value={state.secondaryBrandColor} onChange={(v) => updateField('secondaryBrandColor', v)} />
          </div>
          <TextArea label="Custom Technical Details" value={state.technicalCustom} onChange={(v) => updateField('technicalCustom', v)} placeholder="e.g. shot on anamorphic lens with heavy grain, specific camera models..." />
        </Accordion>

        <Accordion title="Main Subject Definition" icon={User} colorClass="text-pink-400" isOpen={openSections.subject} onToggle={() => toggleSection('subject')}>
          <ToggleSwitch label="Use Image Reference for Main Subject" checked={state.useReferenceSubject} onChange={(v) => updateField('useReferenceSubject', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Select label="Subject Type" value={state.subjectType} onChange={(v) => updateField('subjectType', v)} options={OPTIONS.subjectType} />
            <Select label="Lifestyle / Class" value={state.lifestyleClass} onChange={(v) => updateField('lifestyleClass', v)} options={OPTIONS.lifestyleClass} />
            <Select label="Gender" value={state.gender} onChange={(v) => updateField('gender', v)} options={OPTIONS.gender} />
            <Select label="Race" value={state.race} onChange={(v) => updateField('race', v)} options={OPTIONS.race} />
            <Select label="Ethnicity" value={state.ethnicity} onChange={(v) => updateField('ethnicity', v)} options={OPTIONS.ethnicity} />
            <Select label="Skin Tone" value={state.skinTone} onChange={(v) => updateField('skinTone', v)} options={OPTIONS.skinTone} />
            <Select label="Skin & Hand Texture" value={state.skinAndHandTexture} onChange={(v) => updateField('skinAndHandTexture', v)} options={OPTIONS.skinAndHandTexture} />
            <Select label="Age" value={state.age} onChange={(v) => updateField('age', v)} options={OPTIONS.age} />
            <Select label="Build" value={state.build} onChange={(v) => updateField('build', v)} options={OPTIONS.build} />
            <Select label="Hair Texture" value={state.hairTexture} onChange={(v) => updateField('hairTexture', v)} options={OPTIONS.hairTexture} />
            <Select label="Hair Style" value={state.hairStyle} onChange={(v) => updateField('hairStyle', v)} options={OPTIONS.hairStyle} />
            <Select label="Hair Color" value={state.hairColor} onChange={(v) => updateField('hairColor', v)} options={OPTIONS.hairColor} />
            <Select label="Eye Gaze & Expression" value={state.expression} onChange={(v) => updateField('expression', v)} options={OPTIONS.expression} />
            <Select label="Body Pose & Movement" value={state.bodyPoseAndMovement} onChange={(v) => updateField('bodyPoseAndMovement', v)} options={OPTIONS.bodyPoseAndMovement} />
          </div>
          <TextInput label="Clothing Style" value={state.clothingStyle} onChange={(v) => updateField('clothingStyle', v)} placeholder="e.g. detailed cyberpunk jacket with neon accents" />
          <TextInput label="Accessories" value={state.accessories} onChange={(v) => updateField('accessories', v)} placeholder="e.g. cybernetic sunglasses, gold chain" />
          <TextArea label="Custom Subject Details" value={state.subjectCustom} onChange={(v) => updateField('subjectCustom', v)} placeholder="e.g. detailed scars on face, specific glowing tattoos..." />
        </Accordion>

        <Accordion title="Supporting Subject Definition" icon={Users} colorClass="text-purple-400" isOpen={openSections.supportingSubject} onToggle={() => toggleSection('supportingSubject')}>
          <ToggleSwitch label="Use Image Reference for Supporting Subject" checked={state.useReferenceSupportingSubject} onChange={(v) => updateField('useReferenceSupportingSubject', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Select label="Subject Type" value={state.supportingSubjectType} onChange={(v) => updateField('supportingSubjectType', v)} options={OPTIONS.subjectType} />
            <Select label="Lifestyle / Class" value={state.supportingLifestyleClass} onChange={(v) => updateField('supportingLifestyleClass', v)} options={OPTIONS.lifestyleClass} />
            <Select label="Gender" value={state.supportingGender} onChange={(v) => updateField('supportingGender', v)} options={OPTIONS.gender} />
            <Select label="Race" value={state.supportingRace} onChange={(v) => updateField('supportingRace', v)} options={OPTIONS.race} />
            <Select label="Ethnicity" value={state.supportingEthnicity} onChange={(v) => updateField('supportingEthnicity', v)} options={OPTIONS.ethnicity} />
            <Select label="Skin Tone" value={state.supportingSkinTone} onChange={(v) => updateField('supportingSkinTone', v)} options={OPTIONS.skinTone} />
            <Select label="Skin & Hand Texture" value={state.supportingSkinAndHandTexture} onChange={(v) => updateField('supportingSkinAndHandTexture', v)} options={OPTIONS.skinAndHandTexture} />
            <Select label="Age" value={state.supportingAge} onChange={(v) => updateField('supportingAge', v)} options={OPTIONS.age} />
            <Select label="Build" value={state.supportingBuild} onChange={(v) => updateField('supportingBuild', v)} options={OPTIONS.build} />
            <Select label="Hair Texture" value={state.supportingHairTexture} onChange={(v) => updateField('supportingHairTexture', v)} options={OPTIONS.hairTexture} />
            <Select label="Hair Style" value={state.supportingHairStyle} onChange={(v) => updateField('supportingHairStyle', v)} options={OPTIONS.hairStyle} />
            <Select label="Hair Color" value={state.supportingHairColor} onChange={(v) => updateField('supportingHairColor', v)} options={OPTIONS.hairColor} />
            <Select label="Eye Gaze & Expression" value={state.supportingExpression} onChange={(v) => updateField('supportingExpression', v)} options={OPTIONS.expression} />
            <Select label="Body Pose & Movement" value={state.supportingBodyPoseAndMovement} onChange={(v) => updateField('supportingBodyPoseAndMovement', v)} options={OPTIONS.bodyPoseAndMovement} />
          </div>
          <TextInput label="Clothing Style" value={state.supportingClothingStyle} onChange={(v) => updateField('supportingClothingStyle', v)} placeholder="e.g. casual streetwear" />
          <TextInput label="Accessories" value={state.supportingAccessories} onChange={(v) => updateField('supportingAccessories', v)} placeholder="e.g. silver necklace, watch" />
          <TextArea label="Custom Supporting Subject Details" value={state.supportingSubjectCustom} onChange={(v) => updateField('supportingSubjectCustom', v)} placeholder="e.g. hovering drone companion, specific details..." />
        </Accordion>

        <Accordion title="Object / Product Definition" icon={Box} colorClass="text-orange-400" isOpen={openSections.object} onToggle={() => toggleSection('object')}>
          <ToggleSwitch label="Use Image Reference for Object/Product" checked={state.useReferenceObject} onChange={(v) => updateField('useReferenceObject', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Select label="Object Type" value={state.objectType} onChange={(v) => updateField('objectType', v)} options={OPTIONS.objectType} />
            <Select label="Material / Texture" value={state.objectMaterial} onChange={(v) => updateField('objectMaterial', v)} options={OPTIONS.objectMaterial} />
            <Select label="Condition / State" value={state.objectCondition} onChange={(v) => updateField('objectCondition', v)} options={OPTIONS.objectCondition} />
            <Select label="Placement / Display Style" value={state.objectPlacement} onChange={(v) => updateField('objectPlacement', v)} options={OPTIONS.objectPlacement} />
            <Select label="Scale / Size" value={state.objectScale} onChange={(v) => updateField('objectScale', v)} options={OPTIONS.objectScale} />
          </div>
          <TextInput label="Primary Color" value={state.objectPrimaryColor} onChange={(v) => updateField('objectPrimaryColor', v)} placeholder="e.g. Neon Green, Matte Black with Gold accents" />
          <TextArea label="Custom Object Details" value={state.objectCustom} onChange={(v) => updateField('objectCustom', v)} placeholder="e.g. glowing circuitry, specific brand markings, reflective surfaces..." />
        </Accordion>

        <Accordion title="Environment / Background" icon={ImageIcon} colorClass="text-emerald-400" isOpen={openSections.environment} onToggle={() => toggleSection('environment')}>
          <ToggleSwitch label="Use Image Reference for Environment" checked={state.useReferenceEnvironment} onChange={(v) => updateField('useReferenceEnvironment', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Select label="Location Type" value={state.locationType} onChange={(v) => updateField('locationType', v)} options={OPTIONS.locationType} />
            <Select label="Location Space" value={state.locationSpace} onChange={(v) => updateField('locationSpace', v)} options={OPTIONS.locationSpace} />
            <Select label="Env Lifestyle / Class" value={state.envLifestyleClass} onChange={(v) => updateField('envLifestyleClass', v)} options={OPTIONS.lifestyleClass} />
            <Select label="Time of Day" value={state.timeOfDay} onChange={(v) => updateField('timeOfDay', v)} options={OPTIONS.timeOfDay} />
          </div>
          <TextInput label="Exact Location Name" value={state.exactLocation} onChange={(v) => updateField('exactLocation', v)} placeholder="e.g. Central Park, New York" />
          <TextArea label="Environment Details / Mood" value={state.environmentDescriptor} onChange={(v) => updateField('environmentDescriptor', v)} placeholder="e.g. bustling street at night, rain puddles reflecting neon, moody atmosphere..." />
          <TextInput label="Google Maps Coordinates" value={state.coordinates} onChange={(v) => updateField('coordinates', v)} placeholder="e.g. 40.7826° N, 73.9656° W" />
        </Accordion>

        <Accordion title="Custom Overrides" icon={Wand2} colorClass="text-amber-400" isOpen={openSections.overrides} onToggle={() => toggleSection('overrides')}>
          <ToggleSwitch label="Use Image Reference for Overrides" checked={state.useReferenceOverrides} onChange={(v) => updateField('useReferenceOverrides', v)} />
          <TextArea label="Core Action / Pose" value={state.coreAction} onChange={(v) => updateField('coreAction', v)} placeholder="e.g. sitting on a bench reading a futuristic glowing book..." />
          <TextArea label="Wardrobe" value={state.wardrobe} onChange={(v) => updateField('wardrobe', v)} placeholder="e.g. detailed cyberpunk jacket with neon accents..." />
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
      <div className="w-full md:w-1/2 lg:w-7/12 shrink-0 h-auto md:h-screen md:sticky md:top-0 p-4 md:p-6 xl:p-10 flex flex-col bg-zinc-950 border-t border-zinc-800 md:border-none z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] md:shadow-none">
        
        <div className="flex justify-between items-end mb-3 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-zinc-100">Live Output</h2>
          <div className="flex flex-col items-end">
            <label className="text-[10px] md:text-xs text-zinc-500 mb-1 uppercase tracking-wider hidden sm:block">Format Flavor</label>
            <select 
              value={flavor} 
              onChange={(e) => setFlavor(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs md:text-sm rounded-md p-1.5 focus:outline-none focus:border-neon-blue transition-colors"
            >
              <option value="standard">Standard (Comma Separated)</option>
              <option value="midjourney">Midjourney Style</option>
              <option value="stablediffusion">Stable Diffusion Style</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-6">
          <div className="h-32 md:h-[40vh] bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6 relative group overflow-y-auto custom-scrollbar">
            {generatePrompt ? (
              <p className="text-sm md:text-xl leading-relaxed text-zinc-200 font-light tracking-wide">{generatePrompt}</p>
            ) : (
              <p className="text-sm md:text-xl leading-relaxed text-zinc-600 font-light italic">Start selecting parameters to build your prompt...</p>
            )}
          </div>

          {flavor === 'stablediffusion' && (
            <div className="h-20 md:h-48 bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6 relative overflow-y-auto custom-scrollbar flex flex-col">
              <span className="text-[10px] md:text-xs text-red-400 font-semibold uppercase tracking-wider mb-1 md:mb-2">Negative Prompt</span>
              <p className="text-xs md:text-base text-zinc-400 leading-relaxed font-light">
                {state.negativePrompt || <span className="italic opacity-50">No negative prompt defined...</span>}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 md:mt-8">
          <button 
            onClick={handleCopy}
            className={`w-full py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 md:gap-3 font-semibold text-sm md:text-lg transition-all duration-300 ${
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
