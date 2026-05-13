/**
 * Calculates an accelerated progress percentage using an ease-out quadratic function.
 * This creates a psychological "momentum" effect by making the first few steps 
 * feel faster than a linear progression.
 */
export function calculateAcceleratedProgress(
  currentStep: number, 
  totalSteps: number
): number {
  if (currentStep < 0) return 0;
  if (currentStep >= totalSteps) return 100;
  
  const linearProgress = currentStep / totalSteps;
  
  // Ease-out quadratic: 1 - (1 - x)^2
  const acceleratedProgress = 1 - Math.pow(1 - linearProgress, 2);
  
  return Math.round(acceleratedProgress * 100);
}
