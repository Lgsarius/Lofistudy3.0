export function ASMRMixer() {
  return (
    <div className="h-full p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Title */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white/90 mb-6">
          ASMR Mixer
        </h2>

        {/* Sound Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sounds.map((sound) => (
            <div
              key={sound.id}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-4 flex flex-col items-center space-y-3"
            >
              {/* Sound Icon */}
              <button
                onClick={() => toggleSound(sound.id)}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-colors ${
                  activeSounds.includes(sound.id)
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <sound.icon className="w-6 h-6 md:w-8 md:h-8" />
              </button>

              {/* Sound Label */}
              <span className="text-sm text-white/90">{sound.label}</span>

              {/* Volume Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolumes[sound.id] || 50}
                onChange={(e) => handleVolumeChange(sound.id, parseInt(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          ))}
        </div>

        {/* Master Volume */}
        <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/90">Master Volume</span>
            <span className="text-sm text-white/60">{masterVolume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        {/* Presets */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white/90">Presets</h3>
            <button
              onClick={handleSavePreset}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              Save Current Mix
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset)}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-left hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/90">
                    {preset.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePreset(preset.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-white/90 transition-opacity"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {preset.activeSounds.map((soundId) => {
                    const sound = sounds.find((s) => s.id === soundId);
                    return sound ? (
                      <sound.icon
                        key={soundId}
                        className="w-4 h-4 text-white/40"
                      />
                    ) : null;
                  })}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 