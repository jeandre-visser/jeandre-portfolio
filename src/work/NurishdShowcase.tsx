import { useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  Barbell,
  Clover,
  Drop,
  FirstAidKit,
  Heart,
  Heartbeat,
  Leaf,
  MagnifyingGlass,
  MapPin,
  PencilSimple,
  Plus,
  Scales,
  ShoppingCart,
  SignIn,
  SlidersHorizontal,
  SquaresFour,
  Stethoscope,
  PersonSimpleRun,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { BrowserFrame, CountUp, Tilt } from "./Kit";
import { useSequence } from "./hooks";

type TabId = "care" | "nutrition" | "plans";

const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: "care", label: "Care", icon: <Stethoscope weight="bold" /> },
  {
    id: "nutrition",
    label: "Nutrition",
    icon: <ArrowSquareOut weight="bold" />,
  },
  { id: "plans", label: "Meal Plans", icon: <SquaresFour weight="fill" /> },
];

type Meal = {
  id: string;
  name: string;
  image: string;
  types: string[];
  tags?: string[];
  ingredients: string[];
  description?: string;
  macros: { cal: number; protein: number; carbs: number; fat: number };
};

const meals: Meal[] = [
  {
    id: "hash",
    name: "Breakfast Hash",
    image: "/work/meal-hash.webp",
    types: ["Meal", "Breakfast"],
    ingredients: ["Zucchini", "Cheese", "Tomato", "Carrots", "Onion"],
    macros: { cal: 500, protein: 19, carbs: 63, fat: 22 },
  },
  {
    id: "scramble",
    name: "Mediterranean Scramble",
    image: "/work/meal-scramble.webp",
    types: ["Meal", "Breakfast"],
    tags: ["Diabetic Friendly"],
    ingredients: ["Spinach", "Tomato", "Eggs", "Mushroom", "Potatoes"],
    description:
      "Scrambled eggs and egg whites with cannellini beans, mushrooms, spinach and sun-dried tomatoes, seasoned with garlic and parsley.",
    macros: { cal: 460, protein: 20, carbs: 50, fat: 22 },
  },
  {
    id: "bbq",
    name: "BBQ Shredded Chicken",
    image: "/work/meal-bbq.webp",
    types: ["Meal", "Lunch", "Dinner"],
    tags: ["Cancer Support", "Low Sodium"],
    ingredients: ["Chicken", "Broccoli", "Potatoes"],
    macros: { cal: 530, protein: 36, carbs: 40, fat: 26 },
  },
];

// Stock portraits from the Nurish'd marketing site, with made-up names.
const dietitians = [
  {
    name: "Elena R.",
    photo: "/work/person-dietitian-c.webp",
    focus: "Diabetes & Pre-Diabetes, Renal Conditions, Weight Loss",
  },
  {
    name: "Maya K.",
    photo: "/work/person-dietitian-b.webp",
    focus: "Gut Health & Microbiome Support, PCOS, Weight Management",
  },
  {
    name: "Carter P.",
    photo: "/work/person-dietitian-video.webp",
    focus: "Celiac, Food Allergies, Gastrointestinal (GI) Health",
  },
];

const programs = [
  {
    group: "Lifestyle Programs",
    items: [
      { label: "Eat Healthy", icon: <Leaf /> },
      { label: "Weight Management", icon: <Scales /> },
      { label: "Muscle Gain", icon: <Barbell /> },
      { label: "Body Recomposition", icon: <PersonSimpleRun /> },
    ],
  },
  {
    group: "Health Programs",
    items: [
      { label: "Obesity", icon: <Heart /> },
      { label: "Heart Disease", icon: <Heartbeat /> },
      { label: "Diabetes", icon: <Drop /> },
      { label: "Renal Conditions", icon: <FirstAidKit /> },
    ],
  },
];

/** Care → Nutrition → a meal opens → Meal Plans. */
const DEMO_STEPS = [4200, 2400, 4400, 4200];
const demoStates: { tab: TabId; mealId?: string }[] = [
  { tab: "care" },
  { tab: "nutrition" },
  { tab: "nutrition", mealId: "scramble" },
  { tab: "plans" },
];

const spring = { type: "spring", stiffness: 260, damping: 28 } as const;

function Sidebar() {
  const items = [
    {
      label: "Explore Menu",
      tone: "blue",
      icon: <ArrowSquareOut weight="bold" />,
    },
    {
      label: "View Dietitians",
      tone: "orange",
      icon: <Stethoscope weight="bold" />,
    },
    {
      label: "Learn about Health",
      tone: "pink",
      icon: <Clover weight="fill" />,
    },
    {
      label: "Try our Programs",
      tone: "green",
      icon: <SquaresFour weight="fill" />,
    },
    {
      label: "Sign In or Create Account",
      tone: "violet",
      icon: <SignIn weight="bold" />,
    },
  ];

  return (
    <aside className="wk-nd-side">
      <span className="wk-nd-logo">
        <img src="/assets/nurishd-logo.png" alt="" />
        Nurish’d
      </span>
      <span className="wk-nd-pills">
        <span className="wk-nd-loc">
          <MapPin weight="bold" />
          Austin, TX
        </span>
        <span className="wk-nd-cart">
          <ShoppingCart weight="bold" />
          <i>0</i>
        </span>
      </span>
      <nav>
        {items.map((item) => (
          <span key={item.label} className="wk-nd-nav">
            <i className={`is-${item.tone}`}>{item.icon}</i>
            {item.label}
          </span>
        ))}
      </nav>
    </aside>
  );
}

function CareTab() {
  return (
    <motion.div
      className="wk-nd-pane"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={spring}
    >
      <p className="wk-nd-heading">Dietitians In Your Area</p>
      <div className="wk-nd-grid">
        {dietitians.map((person, index) => (
          <motion.article
            className="wk-nd-card wk-nd-dietitian"
            key={person.name}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring, delay: 0.08 + index * 0.08 }}
          >
            <span className="wk-nd-photo">
              <img src={person.photo} alt="" loading="lazy" />
            </span>
            <span className="wk-nd-dietitian-copy">
              <b>{person.name}</b>
              <small>Registered Dietitian</small>
              <p>{person.focus}</p>
              <span className="wk-nd-ghost">Book Now</span>
            </span>
          </motion.article>
        ))}
      </div>
      <motion.div
        className="wk-nd-banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p>
          Not sure where to start? Book our free 15-minute nutrition assessment
          and jump start your health journey.
        </p>
        <span>Book Now</span>
      </motion.div>
    </motion.div>
  );
}

function MealCard({
  meal,
  onOpen,
  index,
}: {
  meal: Meal;
  onOpen: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      className="wk-nd-card wk-nd-meal"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.06 + index * 0.07 }}
      whileHover={{ y: -4 }}
      aria-label={`Open ${meal.name}`}
    >
      <span className="wk-nd-plate">
        <motion.img
          layoutId={`meal-img-${meal.id}`}
          src={meal.image}
          alt=""
          transition={spring}
        />
        <span className="wk-nd-add">
          <Plus weight="bold" />
        </span>
      </span>
      <span className="wk-nd-meal-copy">
        <motion.b layoutId={`meal-name-${meal.id}`} transition={spring}>
          {meal.name}
        </motion.b>
        <span className="wk-nd-price">$14.99</span>
        <span className="wk-nd-chips">
          {meal.types.map((type, typeIndex) => (
            <i key={type} className={typeIndex === 0 ? "is-solid" : undefined}>
              {type}
            </i>
          ))}
        </span>
        {meal.tags && (
          <span className="wk-nd-chips">
            {meal.tags.map((tag) => (
              <i key={tag} className="is-tag">
                <Heart weight="fill" />
                {tag}
              </i>
            ))}
          </span>
        )}
        <span className="wk-nd-macros">
          {meal.macros.cal} cal · {meal.macros.protein} P · {meal.macros.carbs}{" "}
          C · {meal.macros.fat} F
        </span>
      </span>
    </motion.button>
  );
}

function MealDetail({ meal, onClose }: { meal: Meal; onClose: () => void }) {
  const macroRows = [
    { label: "Protein", value: meal.macros.protein, max: 40 },
    { label: "Carbs", value: meal.macros.carbs, max: 70 },
    { label: "Fat", value: meal.macros.fat, max: 40 },
  ];

  return (
    <motion.div
      className="wk-nd-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button type="button" className="wk-nd-back" onClick={onClose}>
        <ArrowLeft weight="bold" />
        Back
      </button>
      <div className="wk-nd-detail-grid">
        <span className="wk-nd-detail-plate">
          <motion.img
            layoutId={`meal-img-${meal.id}`}
            src={meal.image}
            alt=""
            transition={spring}
          />
        </span>
        <div className="wk-nd-detail-copy">
          <motion.b
            className="wk-nd-detail-name"
            layoutId={`meal-name-${meal.id}`}
            transition={spring}
          >
            {meal.name}
          </motion.b>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, ...spring }}
          >
            <span className="wk-nd-price is-large">$14.99</span>
            {meal.description && <p>{meal.description}</p>}
            <p className="wk-nd-made">
              Made with <Heart weight="fill" /> by Food For Health
            </p>
            <span className="wk-nd-chips">
              {meal.ingredients.map((item) => (
                <i key={item}>{item}</i>
              ))}
            </span>
            <div className="wk-nd-nutrition">
              <span className="wk-nd-kcal">
                <CountUp value={meal.macros.cal} />
                <small>kcal</small>
              </span>
              {macroRows.map((row, index) => (
                <span className="wk-nd-macro" key={row.label}>
                  <small>{row.label}</small>
                  <span className="wk-nd-bar">
                    <motion.i
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: row.value / row.max }}
                      transition={{
                        delay: 0.3 + index * 0.1,
                        duration: 0.9,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </span>
                  <b>
                    <CountUp value={row.value} suffix="g" />
                  </b>
                </span>
              ))}
            </div>
            <span className="wk-nd-cta">Add to Cart</span>
            <span className="wk-nd-sub">
              Subscribe to a Meal Plan &amp; Save 10%
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function NutritionTab({
  mealId,
  onOpen,
  onClose,
}: {
  mealId?: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const openMeal = meals.find((meal) => meal.id === mealId);

  return (
    <motion.div
      className="wk-nd-pane"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={spring}
    >
      <AnimatePresence mode="wait" initial={false}>
        {openMeal ? (
          <MealDetail key="detail" meal={openMeal} onClose={onClose} />
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="wk-nd-vendor">
              <span>
                <b>Food For Health</b>
                <small>Powered by Nurish’d</small>
              </span>
              <span className="wk-nd-filter">
                <SlidersHorizontal weight="bold" />
                Filters
              </span>
            </div>
            <div className="wk-nd-searchrow">
              <span className="wk-nd-search">
                <MagnifyingGlass />
                Search...
              </span>
              <small>22 results</small>
            </div>
            <div className="wk-nd-grid">
              {meals.map((meal, index) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  index={index}
                  onOpen={() => onOpen(meal.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PlansTab() {
  return (
    <motion.div
      className="wk-nd-pane"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={spring}
    >
      <p className="wk-nd-heading">
        Select a Program Designed For Your Success
      </p>
      <span className="wk-nd-chips is-perks">
        <i>Pause and resume at any time</i>
        <i>Transparent pricing, no hidden fees</i>
        <i>Supported by dietitians</i>
      </span>
      {programs.map((group, groupIndex) => (
        <div key={group.group} className="wk-nd-programs">
          <small>{group.group}</small>
          <div className="wk-nd-program-grid">
            {group.items.map((item, index) => (
              <motion.span
                key={item.label}
                className={`wk-nd-program is-${groupIndex}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 22,
                  delay: 0.05 + (groupIndex * 4 + index) * 0.05,
                }}
              >
                {item.icon}
                {item.label}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export function NurishdAppShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const [manual, setManual] = useState<{ tab: TabId; mealId?: string } | null>(
    null,
  );
  const [step] = useSequence(
    DEMO_STEPS,
    isInView && !reduceMotion && manual === null,
  );
  const view = manual ?? demoStates[step];

  return (
    <div className="wk-showcase wk-nd-showcase" ref={ref}>
      <p className="sr-only">
        The Nurish’d web app. It switches between Care, with dietitians in your
        area, Nutrition, with meals from a local partner and their nutrition
        facts, and Meal Plans, with lifestyle and health programs.
      </p>
      <Tilt max={3}>
        <BrowserFrame url="app.nurishd.store" className="wk-nd-browser">
          <div className="wk-nd-app">
            <Sidebar />
            <div className="wk-nd-main">
              <header className="wk-nd-top">
                <b>
                  {view.tab === "nutrition" ? "Food For Health" : "Welcome"}
                </b>
                <span className="wk-nd-location">
                  <span>
                    <small>Location</small>
                    Austin, TX
                  </span>
                  <PencilSimple />
                </span>
              </header>
              <div
                className="wk-nd-tabs"
                role="group"
                aria-label="Preview section"
              >
                {tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    className={`is-${tab.id}`}
                    aria-pressed={view.tab === tab.id}
                    onClick={() => setManual({ tab: tab.id })}
                  >
                    {view.tab === tab.id && (
                      <motion.i
                        layoutId="wk-nd-tab"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="wk-nd-tab-icon">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <LayoutGroup>
                <AnimatePresence mode="wait" initial={false}>
                  {view.tab === "care" && <CareTab key="care" />}
                  {view.tab === "nutrition" && (
                    <NutritionTab
                      key="nutrition"
                      mealId={view.mealId}
                      onOpen={(mealId) =>
                        setManual({ tab: "nutrition", mealId })
                      }
                      onClose={() => setManual({ tab: "nutrition" })}
                    />
                  )}
                  {view.tab === "plans" && <PlansTab key="plans" />}
                </AnimatePresence>
              </LayoutGroup>
            </div>
          </div>
        </BrowserFrame>
      </Tilt>
      {manual && (
        <button
          type="button"
          className="wk-replay-demo"
          onClick={() => setManual(null)}
        >
          Play the tour again
          <ArrowRight weight="bold" />
        </button>
      )}
    </div>
  );
}
