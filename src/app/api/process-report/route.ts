import { NextRequest, NextResponse } from "next/server";

interface HealthParameter {
  name: string;
  value: string;
  unit?: string;
  normalRange?: string;
  status?: 'normal' | 'high' | 'low';
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    console.log('📝 Received text for parsing:');
    console.log('='.repeat(50));
    console.log(text);
    console.log('='.repeat(50));

    const parameters = parseHealthParameters(text);
    
    console.log('🔍 Parsed parameters:', parameters.length, 'found');
    console.table(parameters);

    return NextResponse.json({ 
      success: true, 
      parameters 
    });

  } catch (error) {
    console.error('❌ Error parsing text:', error);
    return NextResponse.json(
      { error: 'Failed to parse text' }, 
      { status: 500 }
    );
  }
}

function parseHealthParameters(text: string): HealthParameter[] {
  const parameters: HealthParameter[] = [];
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  console.log('🔍 All lines to parse:');
  lines.forEach((line, index) => {
    console.log(`Line ${index}: "${line}"`);
  });

  // Enhanced patterns for different lab report formats
  const patterns = [
    // Pattern 1: "PARAMETER NAME value unit (range)" or "PARAMETER NAME value unit range"
    /([A-Za-z\s()]+(?:COUNT|VOLUME|CONCENTRATION|HAEMOGLOBIN|HEMATOCRIT|MCV|MCH|MCHC|PLATELET))\s*([0-9.]+)\s*([a-zA-Z/%]+)?\s*(?:\(([^)]+)\)|([0-9.-]+\s*-\s*[0-9.]+))/gi,
    
    // Pattern 2: Lab report format "TEST NAME Result Reference"
    /([A-Za-z\s()]+(?:HAEMOGLOBIN|COUNT|VOLUME|HEMATOCRIT|MCV|MCH|MCHC|PLATELET))[^0-9]*([0-9.]+)\s*([a-zA-Z/%]*)\s*([0-9.-]+\s*-\s*[0-9.]+|\([^)]+\))/gi,
    
    // Pattern 3: Simple "Parameter: value unit"
    /([A-Za-z\s]{4,}):\s*([0-9.]+)\s*([A-Za-z/%]+)?/gi,
    
    // Pattern 4: Table format with spaces
    /([A-Za-z\s()]{4,}(?:HAEMOGLOBIN|COUNT|VOLUME|HEMATOCRIT|MCV|MCH|MCHC|PLATELET))\s+([0-9.]+)\s+([a-zA-Z/%]*)\s+([0-9.-]+\s*-\s*[0-9.]+)/gi,
    
    // Pattern 5: Specific pattern for this lab report format
    /(HAEMOGLOBIN|RED BLOOD.*COUNT|PCV|HEMATOCRIT|MCV|MCH|MCHC|PLATELET.*COUNT|TOTAL COUNT)\s*(?:\([^)]*\))?\s*([0-9.]+)\s*([a-zA-Z/%]*)\s*([0-9.-]+\s*-\s*[0-9.]+|\([^)]+\))/gi
  ];

  // Expanded health parameters
  const healthKeywords = [
    'haemoglobin', 'hemoglobin', 'hb', 'count', 'platelet', 'wbc', 'rbc', 
    'hematocrit', 'pcv', 'mcv', 'mch', 'mchc', 'neutrophil', 'lymphocyte',
    'monocyte', 'eosinophil', 'basophil', 'glucose', 'cholesterol', 'hdl', 
    'ldl', 'triglycerides', 'creatinine', 'urea', 'bun', 'sodium', 'potassium', 
    'chloride', 'tsh', 'vitamin', 'iron', 'calcium', 'blood', 'sugar', 
    'pressure', 'level', 'serum', 'plasma', 'volume'
  ];

  console.log('🔍 Parsing lines:', lines.length);

  // First, try to parse each line individually
  for (const line of lines) {
    console.log('📝 Processing line:', line);
    
    // Manual parsing for specific patterns in this lab report
    if (line.includes('HAEMOGLOBIN') && /[0-9.]+/.test(line)) {
      const valueMatch = line.match(/([0-9.]+)/);
      const rangeMatch = line.match(/([0-9.-]+\s*-\s*[0-9.]+)/);
      if (valueMatch) {
        parameters.push({
          name: 'Haemoglobin',
          value: valueMatch[1],
          unit: 'g/dL',
          normalRange: rangeMatch ? rangeMatch[1] : '12.0-15.0',
          status: determineStatus(parseFloat(valueMatch[1]), rangeMatch ? rangeMatch[1] : '12.0-15.0')
        });
        console.log('✅ Added Haemoglobin manually');
      }
    }
    
    if (line.includes('RED BLOOD') && line.includes('COUNT') && /[0-9.]+/.test(line)) {
      const valueMatch = line.match(/([0-9.]+)/);
      const rangeMatch = line.match(/([0-9.-]+\s*-\s*[0-9.]+)/);
      if (valueMatch) {
        parameters.push({
          name: 'Red Blood Cell Count',
          value: valueMatch[1],
          unit: 'million/cumm',
          normalRange: rangeMatch ? rangeMatch[1] : '3.8-4.8',
          status: determineStatus(parseFloat(valueMatch[1]), rangeMatch ? rangeMatch[1] : '3.8-4.8')
        });
        console.log('✅ Added RBC Count manually');
      }
    }
    
    if ((line.includes('PCV') || line.includes('HEMATOCRIT')) && /[0-9.]+/.test(line)) {
      const valueMatch = line.match(/([0-9.]+)/);
      const rangeMatch = line.match(/([0-9.-]+\s*-\s*[0-9.]+)/);
      if (valueMatch) {
        parameters.push({
          name: 'PCV (Hematocrit)',
          value: valueMatch[1],
          unit: '%',
          normalRange: rangeMatch ? rangeMatch[1] : '36.0-46.0',
          status: determineStatus(parseFloat(valueMatch[1]), rangeMatch ? rangeMatch[1] : '36.0-46.0')
        });
        console.log('✅ Added PCV manually');
      }
    }
    
    if (line.includes('MCV') && /[0-9.]+/.test(line)) {
      const valueMatch = line.match(/([0-9.]+)/);
      if (valueMatch) {
        parameters.push({
          name: 'MCV (Mean Corpuscular Volume)',
          value: valueMatch[1],
          unit: 'fL',
          normalRange: '80-100',
          status: determineStatus(parseFloat(valueMatch[1]), '80-100')
        });
        console.log('✅ Added MCV manually');
      }
    }
    
    if (line.includes('PLATELET') && line.includes('COUNT') && /[0-9.]+/.test(line)) {
      const valueMatch = line.match(/([0-9.]+)/);
      const rangeMatch = line.match(/([0-9.-]+\s*-\s*[0-9.]+)/);
      if (valueMatch) {
        parameters.push({
          name: 'Platelet Count',
          value: valueMatch[1],
          unit: 'thousand/cumm',
          normalRange: rangeMatch ? rangeMatch[1] : '150-450',
          status: determineStatus(parseFloat(valueMatch[1]), rangeMatch ? rangeMatch[1] : '150-450')
        });
        console.log('✅ Added Platelet Count manually');
      }
    }
    
    if (line.includes('TOTAL COUNT') && /[0-9.]+/.test(line)) {
      const valueMatch = line.match(/([0-9.]+)/);
      const rangeMatch = line.match(/([0-9.-]+\s*-\s*[0-9.]+)/);
      if (valueMatch) {
        parameters.push({
          name: 'Total Count (WBC)',
          value: valueMatch[1],
          unit: 'thousand/cumm',
          normalRange: rangeMatch ? rangeMatch[1] : '4.0-10.0',
          status: determineStatus(parseFloat(valueMatch[1]), rangeMatch ? rangeMatch[1] : '4.0-10.0')
        });
        console.log('✅ Added Total Count manually');
      }
    }
    
    // Then try regex patterns
    for (const pattern of patterns) {
      const matches = [...line.matchAll(pattern)];
      
      for (const match of matches) {
        const name = match[1]?.trim();
        const value = match[2]?.trim();
        const unit = match[3]?.trim();
        const range = match[4]?.trim() || match[5]?.trim();

        console.log('🎯 Found regex match:', { name, value, unit, range });

        if (name && value && isHealthParameter(name, healthKeywords)) {
          const status = determineStatus(parseFloat(value), range);
          
          const parameter = {
            name: name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
            value,
            unit: unit || undefined,
            normalRange: range || undefined,
            status
          };
          
          parameters.push(parameter);
          console.log('✅ Added parameter via regex:', parameter);
        }
      }
      
      pattern.lastIndex = 0;
    }
  }

  console.log('🎉 Final parsed parameters:', parameters);
  return parameters;
}

function isHealthParameter(name: string, keywords: string[]): boolean {
  const lowerName = name.toLowerCase();
  const isMatch = keywords.some(keyword => lowerName.includes(keyword)) || 
         lowerName.length > 2;
  
  console.log('🔍 Health parameter check:', name, '→', isMatch);
  return isMatch;
}

function determineStatus(value: number, range?: string): 'normal' | 'high' | 'low' | undefined {
  if (!range) return undefined;

  console.log('📊 Determining status for value:', value, 'range:', range);

  const rangeMatch = range.match(/([0-9.]+)\s*-\s*([0-9.]+)/);
  const lessThanMatch = range.match(/<\s*([0-9.]+)/);
  const greaterThanMatch = range.match(/>\s*([0-9.]+)/);

  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    
    if (value < min) return 'low';
    if (value > max) return 'high';
    return 'normal';
  } else if (lessThanMatch) {
    const threshold = parseFloat(lessThanMatch[1]);
    return value < threshold ? 'normal' : 'high';
  } else if (greaterThanMatch) {
    const threshold = parseFloat(greaterThanMatch[1]);
    return value > threshold ? 'normal' : 'low';
  }

  return undefined;
}