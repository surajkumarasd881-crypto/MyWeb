import { NoteData } from '../types/note';

export const SAMPLE_PHYSICS_NOTE: NoteData = {
  id: 'sample-physics-newton',
  title: "Newton's Laws of Motion & Friction",
  youtubeUrl: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds',
  videoId: 'kKKM8Y-u7ds',
  subject: 'Physics',
  difficulty: 'Intermediate',
  introduction: 'Newtonian mechanics forms the bedrock of classical physics. It relates the motion of macroscopic objects to the vector sum of forces acting upon them, explaining planetary orbits, vehicle dynamics, and everyday balance.',
  summary: 'A comprehensive study of inertia, F=ma, action-reaction pairs, free-body diagrams, and frictional resistance.',
  theme: 'classic',
  font: 'kalam',
  createdAt: '2026-09-28T10:00:00.000Z',
  updatedAt: '2026-09-28T10:00:00.000Z',
  isCustomOrSample: true,
  sections: [
    {
      id: 'sec-1',
      title: 'First Law: The Law of Inertia',
      content: 'A body continues in its state of rest or uniform motion in a straight line unless compelled by an external net unbalanced force (∑F_ext ≠ 0). Inertia is inherently measured by mass (m). Greater mass means greater inertia and reluctance to accelerate.',
      key_points: [
        'If ∑F = 0, acceleration a = 0 (velocity is constant)',
        'Inertia of rest vs Inertia of motion vs Inertia of direction',
        'Valid strictly in inertial (non-accelerating) frames of reference'
      ],
      doodle_type: 'atom'
    },
    {
      id: 'sec-2',
      title: 'Second Law: Fundamental Equation (F = ma)',
      content: 'The rate of change of linear momentum (p = mv) of a body is directly proportional to the applied force and occurs in the direction of that force. When mass is constant: F = dp/dt = d(mv)/dt = m(dv/dt) = ma.',
      key_points: [
        'Vector nature: ∑Fx = m*ax, ∑Fy = m*ay',
        'Momentum unit: kg·m/s (or N·s)',
        'Impulse J = ∫ F dt = ∆p (area under F-t curve)'
      ],
      formula: 'F_{net} = m \\cdot a = \\frac{dp}{dt}',
      doodle_type: 'math'
    },
    {
      id: 'sec-3',
      title: 'Third Law: Action & Reaction Pairs',
      content: 'To every action, there is an equal and opposite reaction. Crucial insight: Action and reaction forces NEVER act on the same body, so they cannot cancel each other out. They act simultaneously between two interacting bodies.',
      key_points: [
        'F_{A on B} = - F_{B on A}',
        'Pairs are of the exact same physical type (e.g., both gravitational or both electromagnetic)',
        'Free Body Diagrams (FBD) must isolate one body at a time'
      ],
      example: 'Rocket propulsion: Exhaust gases are expelled backwards; reaction pushes the rocket upward even in vacuum.',
      doodle_type: 'bulb'
    },
    {
      id: 'sec-4',
      title: 'Frictional Forces: Static vs Kinetic',
      content: 'Friction is the contact force resisting relative lateral motion between surfaces. Static friction (fs) is self-adjusting up to a threshold (fs_max = µs * N). Once sliding commences, kinetic friction (fk = µk * N) applies and is generally lower (µk < µs).',
      key_points: [
        'Normal force (N) is perpendicular to contact surface',
        'Static friction self-adjusts: 0 ≤ fs ≤ µs * N',
        'Friction is independent of apparent surface area'
      ],
      formula: 'f_{s,max} = \\mu_s N, \\quad f_k = \\mu_k N',
      doodle_type: 'triangle' as any
    }
  ],
  formulas: [
    {
      name: "Newton's Second Law",
      formula: 'F_{net} = m \\cdot a',
      where: 'm = mass in kg, a = acceleration in m/s²',
      units: 'Newtons (N = kg·m/s²)'
    },
    {
      name: 'Linear Momentum & Impulse',
      formula: 'J = \\Delta p = F_{avg} \\cdot \\Delta t = m(v - u)',
      where: 'J = Impulse, p = momentum, u = initial vel, v = final vel',
      units: 'N·s or kg·m/s'
    },
    {
      name: 'Maximum Static Friction',
      formula: 'f_{s,max} = \\mu_s \\cdot N',
      where: 'µs = coeff of static friction, N = normal force',
      units: 'Dimensionless (µ), N (force)'
    }
  ],
  definitions: [
    {
      term: 'Inertia',
      definition: 'The inherent property of a physical body by virtue of which it resists changes in its state of rest or uniform rectilinear motion.'
    },
    {
      term: 'Inertial Reference Frame',
      definition: 'A frame of reference in which Newton’s first law holds true without fictitious/pseudo forces (zero acceleration).'
    },
    {
      term: 'Impulse',
      definition: 'A large force acting over a brief time duration, quantified as the time-integral of force or change in momentum.'
    }
  ],
  examples: [
    {
      problem: 'A 5 kg block rests on a horizontal plane with µs = 0.4 and µk = 0.3. A horizontal pull of 15 N is applied. (g = 9.8 m/s²). Determine frictional force and acceleration.',
      solution: 'Normal force N = m*g = 5 * 9.8 = 49 N. Maximum static friction fs,max = 0.4 * 49 = 19.6 N. Since applied force (15 N) < fs,max (19.6 N), block does not move.',
      takeaway: 'Static friction adjusts exactly to match applied force (fs = 15 N). Acceleration a = 0 m/s².'
    }
  ],
  important_points: [
    'Mass is scalar and invariant with speed in non-relativistic mechanics.',
    'Weight is a vector force: W = mg, varying with local gravity.',
    'Action and reaction act on separate bodies — never add them in one FBD.',
    'Apparent weight inside an accelerating elevator: N = m(g ± a).'
  ],
  exam_important: [
    {
      topic: 'Apparent Weight in Elevators',
      probability: 'Very High',
      tip: 'Remember: When accelerating upwards, N = m(g+a) (feels heavier). Accelerating downwards, N = m(g-a). Free fall (a=g) gives weightlessness (N=0).'
    },
    {
      topic: 'Connected Bodies & Pulley Systems',
      probability: 'High',
      tip: 'Draw separate FBDs for each block. Keep tension T identical along a massless, frictionless string.'
    },
    {
      topic: 'Friction on Inclined Plane',
      probability: 'High',
      tip: 'Angle of repose θ where sliding begins satisfies tan(θ) = µs.'
    }
  ],
  quick_revision: [
    '1st Law = Definition of Force & Inertia',
    '2nd Law = Measurement of Force (F = ma)',
    '3rd Law = Nature of Force (Pairs on distinct objects)',
    'Impulse = Area under F-t graph = ∆p',
    'µs is always strictly greater than µk'
  ],
  questions: [
    {
      question: 'Why does a passenger jerk forward when a speeding bus applies sudden brakes?',
      answer: 'Due to inertia of motion. The lower part of the body stops with the vehicle, while the upper torso continues moving forward at the previous velocity.',
      type: 'concept'
    },
    {
      question: 'Can a body have zero velocity but non-zero acceleration?',
      answer: 'Yes! At the peak of a vertical projectile trajectory, instantaneous velocity is 0, but acceleration is g (9.8 m/s² downwards).',
      type: 'concept'
    },
    {
      question: 'A 1000 kg car traveling at 20 m/s is brought to rest in 5 seconds. What average braking force is required?',
      answer: 'a = (0 - 20)/5 = -4 m/s². Braking force F = m * |a| = 1000 * 4 = 4,000 N.',
      type: 'numerical'
    }
  ],
  final_revision: 'Newtonian mechanics unifies dynamics via three vector laws. Remember: Force causes acceleration, not velocity. Always isolate bodies in FBDs before writing F_net = ma. Friction opposes impending or actual relative motion, bounded by normal reaction.'
};

export const SAMPLE_CALCULUS_NOTE: NoteData = {
  id: 'sample-math-derivatives',
  title: 'Calculus: Derivatives & Chain Rule Masterclass',
  youtubeUrl: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
  videoId: 'WUvTyaaNkzM',
  subject: 'Mathematics',
  difficulty: 'Advanced',
  introduction: 'Derivatives quantify the instantaneous rate of change of a function. Geometrically, the derivative represents the slope of the tangent line to the curve y = f(x) at any chosen coordinate.',
  summary: 'Foundations of limits, difference quotient, product rule, quotient rule, and the universal chain rule.',
  theme: 'graph',
  font: 'patrick',
  createdAt: '2026-09-27T14:30:00.000Z',
  updatedAt: '2026-09-27T14:30:00.000Z',
  isCustomOrSample: true,
  sections: [
    {
      id: 'sec-calc-1',
      title: 'First Principles Definition',
      content: 'The derivative f\'(x) is derived as the limit of secant slopes as the horizontal interval h shrinks towards zero.',
      key_points: [
        "f'(x) = lim_{h->0} [f(x+h) - f(x)] / h",
        'Differentiability implies continuity, but continuity does NOT guarantee differentiability (e.g. |x| at x=0)'
      ],
      formula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
      doodle_type: 'chart'
    },
    {
      id: 'sec-calc-2',
      title: 'The Chain Rule for Composite Functions',
      content: 'If y = f(u) and u = g(x), both differentiable, then the derivative of y with respect to x is the product of their individual derivatives.',
      key_points: [
        'dy/dx = (dy/du) * (du/dx)',
        'Work from the outermost layer progressively to the innermost layer',
        'Never change the inside function until you differentiate it'
      ],
      formula: "\\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)",
      doodle_type: 'math'
    }
  ],
  formulas: [
    {
      name: 'Power Rule',
      formula: "\\frac{d}{dx}[x^n] = n x^{n-1}",
      where: 'n is any real constant'
    },
    {
      name: 'Product Rule',
      formula: "\\frac{d}{dx}[u \\cdot v] = u'v + uv'",
      where: 'u and v are differentiable functions'
    },
    {
      name: 'Quotient Rule',
      formula: "\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}",
      where: 'v(x) \\neq 0'
    }
  ],
  definitions: [
    {
      term: 'Instantaneous Rate of Change',
      definition: 'The limiting value of the average rate of change over an infinitesimally small interval.'
    }
  ],
  examples: [
    {
      problem: 'Differentiate y = sin(3x² + 5)',
      solution: 'Let u = 3x² + 5. Then y = sin(u). dy/du = cos(u) and du/dx = 6x. dy/dx = cos(3x² + 5) * 6x = 6x·cos(3x² + 5).',
      takeaway: 'Derivative of outer function evaluated at unchanged inner, multiplied by derivative of inner.'
    }
  ],
  important_points: [
    'd/dx [e^x] = e^x',
    'd/dx [ln(x)] = 1/x for x > 0',
    'd/dx [sin(x)] = cos(x), d/dx [cos(x)] = -sin(x)'
  ],
  exam_important: [
    {
      topic: 'Implicit Differentiation',
      probability: 'Very High',
      tip: 'Whenever differentiating terms containing y, append dy/dx due to the chain rule.'
    }
  ],
  quick_revision: [
    'Slope of tangent = f\'(x)',
    'Product = 1st derivative * 2nd + 1st * 2nd derivative',
    'Chain rule = Outer derivative × Inner derivative'
  ],
  questions: [
    {
      question: 'What is the derivative of f(x) = ln(cos x)?',
      answer: "f'(x) = [1/cos(x)] * (-sin(x)) = -tan(x).",
      type: 'numerical'
    }
  ],
  final_revision: 'Calculus transforms geometric slopes into algebraic operations. Master product, quotient, and chain rules before progressing to optimization and differential equations.'
};

export const ALL_SAMPLE_NOTES: NoteData[] = [
  SAMPLE_PHYSICS_NOTE,
  SAMPLE_CALCULUS_NOTE
];
