// Archivo de prueba para verificar que los cálculos de fase lunar sean correctos
// Puedes ejecutar esto en la consola del navegador para verificar

function testMoonPhaseCalculations() {
  console.log("🌙 PRUEBA DE SINCRONIZACIÓN DE FASES LUNARES\n");
  
  // Casos de prueba conocidos
  const testCases = [
    { phase: 0.0, expected: "Luna Nueva", illumination: 0 },
    { phase: 0.125, expected: "Creciente Iluminante", illumination: 25 },
    { phase: 0.25, expected: "Cuarto Creciente", illumination: 50 },
    { phase: 0.375, expected: "Creciente Gibosa", illumination: 75 },
    { phase: 0.5, expected: "Luna Llena", illumination: 100 },
    { phase: 0.625, expected: "Menguante Gibosa", illumination: 75 },
    { phase: 0.75, expected: "Cuarto Menguante", illumination: 50 },
    { phase: 0.875, expected: "Menguante Iluminante", illumination: 25 },
  ];

  testCases.forEach(test => {
    // Calcular usando la misma fórmula que el código
    const angle = test.phase * Math.PI * 2;
    const lightX = Math.sin(angle);
    const illuminationFactor = (lightX + 1) / 2;
    const calculatedIllumination = Math.round(illuminationFactor * 100);
    
    const match = Math.abs(calculatedIllumination - test.illumination) < 5 ? "✅" : "❌";
    
    console.log(`${match} Fase: ${test.phase.toFixed(3)} (${test.expected})`);
    console.log(`   Esperado: ${test.illumination}% | Calculado: ${calculatedIllumination}%`);
    console.log(`   lightX: ${lightX.toFixed(3)} | factor: ${illuminationFactor.toFixed(3)}\n`);
  });
  
  console.log("📊 RESUMEN:");
  console.log("Si todos tienen ✅, la sincronización es perfecta!");
}

// Para ejecutar en la consola del navegador:
// testMoonPhaseCalculations();

export { testMoonPhaseCalculations };
