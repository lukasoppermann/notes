/**
 * Test suite for URL normalization
 * 
 * This file tests the normalizeUrl function to ensure it correctly handles:
 * - Em-dashes (—) vs hyphens (-)
 * - URL encoding (%20, %C3%A2, etc.)
 * - Special characters (&, accents like â, é, ü)
 * - Different folder depths (root, 1, 2, 3+ levels)
 * - Trailing slashes
 * - File extensions
 */

/**
 * Normalize URL for comparison
 * This is the same function used in NavList.astro
 */
function normalizeUrl(url) {
  if (!url) return '';
  
  // Decode first if needed
  let normalized = url;
  try {
    normalized = decodeURIComponent(url);
  } catch {
    // If decoding fails, use as-is
  }
  
  // Add leading slash if not present
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  
  // Remove file extensions and index
  normalized = normalized
    .replace('.html', '')
    .replace('.md', '')
    .replace('/index', '')
    .replace(/\/+/g, '/')  // Replace multiple slashes with single slash
    .replace(/\/$/, '');   // Remove trailing slash for comparison
  
  // Replace em-dashes with hyphens for comparison (to match slug normalization)
  normalized = normalized.replace(/—/g, '-');
  
  return normalized;
}

// Test cases organized by scenario
const testScenarios = {
  'Root level files': [
    {
      desc: 'Simple root file',
      inputs: ['Rubics Cube', '/Rubics%20Cube/', '/Rubics Cube/'],
      expected: '/Rubics Cube'
    }
  ],
  
  'One level subfolder': [
    {
      desc: 'Simple subfolder with spaces',
      inputs: ['Snowboarding/Learning 2025', '/Snowboarding/Learning%202025/', '/Snowboarding/Learning 2025/'],
      expected: '/Snowboarding/Learning 2025'
    }
  ],
  
  'Two levels subfolders': [
    {
      desc: 'Two levels with ampersand',
      inputs: [
        'Cooking & Baking/Bread/Backen',
        '/Cooking%20%26%20Baking/Bread/Backen/',
        '/Cooking & Baking/Bread/Backen/'
      ],
      expected: '/Cooking & Baking/Bread/Backen'
    },
    {
      desc: 'Two levels with em-dash',
      inputs: [
        'Cooking & Baking/Cakes/Cream — Vanilla cream (pudding)',
        '/Cooking%20%26%20Baking/Cakes/Cream%20-%20Vanilla%20cream%20(pudding)/',
        '/Cooking & Baking/Cakes/Cream - Vanilla cream (pudding)/'
      ],
      expected: '/Cooking & Baking/Cakes/Cream - Vanilla cream (pudding)'
    },
    {
      desc: 'Two levels with accented characters (â)',
      inputs: [
        'Cooking & Baking/Cakes/Crust — Pâte Brise (savory)',
        '/Cooking%20%26%20Baking/Cakes/Crust%20-%20P%C3%A2te%20Brise%20(savory)/',
        '/Cooking & Baking/Cakes/Crust - Pâte Brise (savory)/'
      ],
      expected: '/Cooking & Baking/Cakes/Crust - Pâte Brise (savory)'
    },
    {
      desc: 'Two levels with accented characters (é)',
      inputs: [
        'Cooking & Baking/Cakes/Crust — Pâte Sucrée',
        '/Cooking%20%26%20Baking/Cakes/Crust%20-%20P%C3%A2te%20Sucr%C3%A9e/',
        '/Cooking & Baking/Cakes/Crust - Pâte Sucrée/'
      ],
      expected: '/Cooking & Baking/Cakes/Crust - Pâte Sucrée'
    },
    {
      desc: 'Two levels with German umlauts (ä, ü)',
      inputs: [
        'Cooking & Baking/Cooking/Dänischer Rotkohl',
        '/Cooking%20%26%20Baking/Cooking/D%C3%A4nischer%20Rotkohl/',
        '/Cooking & Baking/Cooking/Dänischer Rotkohl/'
      ],
      expected: '/Cooking & Baking/Cooking/Dänischer Rotkohl'
    },
    {
      desc: 'Two levels with German umlauts (ü)',
      inputs: [
        'Cooking & Baking/Cooking/Kürbis-Eintopf',
        '/Cooking%20%26%20Baking/Cooking/K%C3%BCrbis-Eintopf/',
        '/Cooking & Baking/Cooking/Kürbis-Eintopf/'
      ],
      expected: '/Cooking & Baking/Cooking/Kürbis-Eintopf'
    }
  ],
  
  'Multiple em-dashes': [
    {
      desc: 'Multiple em-dashes in same path',
      inputs: [
        'Cooking & Baking/Cakes/General — Cake & Pie',
        '/Cooking%20%26%20Baking/Cakes/General%20-%20Cake%20%26%20Pie/',
        '/Cooking & Baking/Cakes/General - Cake & Pie/'
      ],
      expected: '/Cooking & Baking/Cakes/General - Cake & Pie'
    },
    {
      desc: 'Em-dashes at different levels',
      inputs: [
        'Test — Folder/Sub — Folder/File — Name',
        '/Test%20-%20Folder/Sub%20-%20Folder/File%20-%20Name/',
        '/Test - Folder/Sub - Folder/File - Name/'
      ],
      expected: '/Test - Folder/Sub - Folder/File - Name'
    }
  ],
  
  'Edge cases': [
    {
      desc: 'File with .html extension',
      inputs: [
        '/Cooking%20%26%20Baking/Cakes/Ganache/index.html',
        '/Cooking & Baking/Cakes/Ganache.html'
      ],
      expected: '/Cooking & Baking/Cakes/Ganache'
    },
    {
      desc: 'File with .md extension',
      inputs: [
        'Cooking & Baking/Cakes/Ganache.md',
        '/Cooking & Baking/Cakes/Ganache.md'
      ],
      expected: '/Cooking & Baking/Cakes/Ganache'
    },
    {
      desc: 'Multiple trailing slashes',
      inputs: [
        '/Rubics%20Cube///',
        '/Rubics Cube///'
      ],
      expected: '/Rubics Cube'
    },
    {
      desc: 'Parentheses in filename',
      inputs: [
        'Snowboarding/Learning 2025 (updated)',
        '/Snowboarding/Learning%202025%20(updated)/',
        '/Snowboarding/Learning 2025 (updated)/'
      ],
      expected: '/Snowboarding/Learning 2025 (updated)'
    }
  ]
};

// Run tests
let totalTests = 0;
let passedTests = 0;
let failedTests = [];

console.log('='.repeat(80));
console.log('URL NORMALIZATION TEST SUITE');
console.log('='.repeat(80));
console.log();

for (const [category, tests] of Object.entries(testScenarios)) {
  console.log(`\n${'▶'.repeat(3)} ${category}`);
  console.log('-'.repeat(80));
  
  for (const test of tests) {
    console.log(`\n  Test: ${test.desc}`);
    
    let allMatch = true;
    const results = [];
    
    for (const input of test.inputs) {
      const normalized = normalizeUrl(input);
      results.push({ input, normalized });
      totalTests++;
      
      if (normalized === test.expected) {
        passedTests++;
        console.log(`    ✓ "${input}"`);
        console.log(`      → "${normalized}"`);
      } else {
        allMatch = false;
        failedTests.push({
          category,
          test: test.desc,
          input,
          expected: test.expected,
          actual: normalized
        });
        console.log(`    ✗ "${input}"`);
        console.log(`      → "${normalized}"`);
        console.log(`      Expected: "${test.expected}"`);
      }
    }
    
    if (allMatch) {
      console.log(`    ✓ All inputs normalized correctly`);
    } else {
      console.log(`    ✗ Some inputs failed`);
    }
  }
}

// Summary
console.log('\n' + '='.repeat(80));
console.log('TEST SUMMARY');
console.log('='.repeat(80));
console.log(`Total tests: ${totalTests}`);
console.log(`Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
console.log(`Failed: ${failedTests.length}`);

if (failedTests.length > 0) {
  console.log('\nFailed tests:');
  failedTests.forEach((fail, i) => {
    console.log(`\n${i + 1}. ${fail.category} - ${fail.test}`);
    console.log(`   Input:    "${fail.input}"`);
    console.log(`   Expected: "${fail.expected}"`);
    console.log(`   Actual:   "${fail.actual}"`);
  });
  process.exit(1);
} else {
  console.log('\n✓ All tests passed!');
  process.exit(0);
}
