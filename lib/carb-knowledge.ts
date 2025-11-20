/**
 * CARB Knowledge Base
 * Priority 1: Official CARB Resources from cleantruckcheck.arb.ca.gov
 */

export interface KnowledgeSource {
  id: string;
  title: string;
  category: string;
  content: string;
  url?: string;
  priority: 1 | 2 | 3; // 1=CARB Official, 2=Blogs, 3=Web
}

export const carbOfficialResources: KnowledgeSource[] = [
  {
    id: 'hdim-fact-sheets',
    title: 'Fact Sheets and Guides',
    category: 'Educational Materials',
    content: 'Official CARB HD I/M program fact sheets and compliance guides. Contains detailed information about Heavy-Duty Inspection and Maintenance requirements, testing procedures, and compliance timelines.',
    url: 'https://cleantruckcheck.arb.ca.gov',
    priority: 1,
  },
  {
    id: 'ctc-vis-training',
    title: 'CTC-VIS Training Video',
    category: 'Educational Materials',
    content: 'Official training video for the Clean Truck Check Vehicle Inspection System (CTC-VIS). Covers system instruction, how to use the portal, and compliance procedures for fleet operators.',
    url: 'https://cleantruckcheck.arb.ca.gov',
    priority: 1,
  },
  {
    id: 'testers-info',
    title: 'Testers and Testing Information',
    category: 'Educational Materials',
    content: 'Information about credentialed testers and approved testing devices. Includes how to find a qualified tester, testing requirements, and device specifications.',
    url: 'https://cleantruckcheck.arb.ca.gov',
    priority: 1,
  },
  {
    id: 'entity-compliance-lookup',
    title: 'Entity Compliance Lookup',
    category: 'Compliance Tools',
    content: 'Tool to check fleet entity compliance status with CARB regulations. Allows fleet owners to verify their compliance standing and identify any outstanding requirements.',
    url: 'https://cleantruckcheck.arb.ca.gov',
    priority: 1,
  },
  {
    id: 'vehicle-compliance-lookup',
    title: 'Vehicle Compliance Lookup',
    category: 'Compliance Tools',
    content: 'Check individual vehicle compliance status by VIN. Verifies if a specific truck meets CARB emission standards and has passed required inspections.',
    url: 'https://cleantruckcheck.arb.ca.gov/Fleet/Vehicle/VehicleComplianceStatusLookup',
    priority: 1,
  },
  {
    id: 'clean-truck-referee',
    title: 'Clean Truck Check Referee Program',
    category: 'Compliance Support',
    content: 'Information about the CARB referee program for dispute resolution and technical assistance with compliance issues.',
    url: 'https://cleantruckcheck.arb.ca.gov',
    priority: 1,
  },
  {
    id: 'carb-email-contact',
    title: 'CARB Support Email',
    category: 'Contact & Support',
    content: 'Primary contact method for CARB HD I/M support: hdim@arb.ca.gov. Use this for troubleshooting compliance questions, account issues, and technical support.',
    url: 'mailto:hdim@arb.ca.gov',
    priority: 1,
  },
  {
    id: 'official-communication',
    title: 'Official CARB Communication',
    category: 'Contact & Support',
    content: 'CARB sends official communication regarding fleet compliance, testing information, and enforcement notifications through registered email addresses. Always check your registered email for important updates.',
    priority: 1,
  },
];

/**
 * Common CARB-related questions and answers
 */
export const carbFAQ = [
  {
    question: 'What does the check engine light mean for CARB compliance?',
    answer: 'A check engine light (malfunction indicator lamp/MIL) indicates an emissions-related problem. Under CARB regulations, vehicles with an illuminated check engine light typically fail compliance testing. The light must be diagnosed and repaired by a qualified technician, and the vehicle must pass emissions testing to be compliant.',
    category: 'Compliance Issues',
  },
  {
    question: 'What does the DPF light mean?',
    answer: 'The DPF (Diesel Particulate Filter) light indicates issues with your particulate filter system. This could mean the DPF needs regeneration (cleaning), is clogged, or has failed. Under CARB regulations, a functioning DPF is required for compliance. You must address this issue with a qualified diesel technician before testing.',
    category: 'Compliance Issues',
  },
  {
    question: 'What does the DEF light mean?',
    answer: 'The DEF (Diesel Exhaust Fluid) light indicates low DEF levels, poor DEF quality, or a problem with the SCR (Selective Catalytic Reduction) system. CARB requires properly functioning SCR systems. Ensure DEF is filled with proper quality fluid and the system is functioning before compliance testing.',
    category: 'Compliance Issues',
  },
  {
    question: 'How often do I need CARB testing?',
    answer: 'Heavy-duty vehicles in California typically require annual CARB compliance testing under the HD I/M (Heavy-Duty Inspection and Maintenance) program. Testing frequency may vary based on vehicle type, model year, and specific regulations. Check your vehicle and entity compliance status for exact requirements.',
    category: 'Testing Requirements',
  },
  {
    question: 'Where can I find a qualified CARB tester?',
    answer: 'Use the "Testers and Testing Information" resource on cleantruckcheck.arb.ca.gov to find credentialed testers in your area. Only CARB-credentialed testers with approved equipment can perform official compliance testing.',
    category: 'Testing Requirements',
  },
  {
    question: 'What is a VIN number and where do I find it?',
    answer: 'A VIN (Vehicle Identification Number) is a unique 17-character code that identifies your specific vehicle. You can find it on the driver side dashboard (visible through windshield), driver door jamb, vehicle registration, or insurance documents. CARB uses VIN to track vehicle compliance.',
    category: 'Vehicle Information',
  },
  {
    question: 'What is an Entity in CARB terms?',
    answer: 'An Entity is a fleet owner or operator registered with CARB. If you own or operate multiple trucks, you register as an entity. This allows CARB to track fleet-level compliance and communicate with fleet operators about their vehicles.',
    category: 'Fleet Management',
  },
  {
    question: 'What is TRUCRS?',
    answer: 'TRUCRS (TRUck Regulation Upload Compliance and Reporting System) is CARBs database for tracking truck and bus fleet compliance. A TRUCRS number is assigned to registered fleet operators and is used to manage compliance reporting.',
    category: 'Fleet Management',
  },
  {
    question: 'What if my vehicle fails the compliance test?',
    answer: 'If your vehicle fails, you must have the emissions issues repaired by a qualified technician, then retest. The test results will indicate what systems failed. You may need DPF cleaning/replacement, DEF system repair, or other emissions system repairs. Contact a CARB-approved repair facility.',
    category: 'Compliance Issues',
  },
  {
    question: 'Can I still operate my truck if its not compliant?',
    answer: 'No. Operating a non-compliant vehicle in California can result in significant fines and penalties. CARB enforcement includes roadside inspections and citations. Ensure your vehicle is compliant before operating it commercially in California.',
    category: 'Compliance Issues',
  },
];

/**
 * Search the knowledge base with CARB context
 */
export function searchKnowledgeBase(query: string): KnowledgeSource[] {
  const lowerQuery = query.toLowerCase();
  const results: KnowledgeSource[] = [];

  // Search official CARB resources
  for (const resource of carbOfficialResources) {
    if (
      resource.title.toLowerCase().includes(lowerQuery) ||
      resource.content.toLowerCase().includes(lowerQuery) ||
      resource.category.toLowerCase().includes(lowerQuery)
    ) {
      results.push(resource);
    }
  }

  // Sort by priority (1 = highest)
  return results.sort((a, b) => a.priority - b.priority);
}

/**
 * Search FAQ with fuzzy matching
 */
export function searchFAQ(query: string) {
  const lowerQuery = query.toLowerCase();
  const results = [];

  for (const item of carbFAQ) {
    const questionMatch = item.question.toLowerCase().includes(lowerQuery);
    const answerMatch = item.answer.toLowerCase().includes(lowerQuery);
    const categoryMatch = item.category.toLowerCase().includes(lowerQuery);

    if (questionMatch || answerMatch || categoryMatch) {
      results.push({
        ...item,
        relevance: questionMatch ? 3 : answerMatch ? 2 : 1,
      });
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance);
}
