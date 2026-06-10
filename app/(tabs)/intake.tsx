import { createIntakeReview } from '@/lib/firestoreClient';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IntakeValue = string | string[];
type StepId =
  | 'gender'
  | 'age'
  | 'orientation'
  | 'relationshipStatus'
  | 'reasonsForTherapy'
  | 'experiencedAnxiety'
  | 'currentlyTakingMedication'
  | 'historyOfAlcoholUse'
  | 'historyOfMarijuanaUse'
  | 'ethnicity'
  | 'sleepingHabits'
  | 'therapyGoals';

type Step = {
  id: StepId;
  question: string;
  label: string;
  options: string[];
  multi?: boolean;
};

const STEPS: Step[] = [
  {
    id: 'gender',
    label: 'Gender',
    question: 'What is your Gender?',
    options: ['Male', 'Female', 'Non binary', 'Trans', 'Agender', 'Other', 'Prefer not to say'],
  },
  {
    id: 'age',
    label: 'Age',
    question: 'How old are you?',
    options: ['13-16', '16-18', '18-21', '21-25', '25-30', '30-40', '40-50', '50-60', '60-70'],
  },
  {
    id: 'orientation',
    label: 'Orientation',
    question: 'How do you identify?',
    options: ['Straight', 'Gay', 'Lesbian', 'Bi or Pan', 'Prefer not to say', 'Questioning', 'Queer', 'Asexual'],
  },
  {
    id: 'relationshipStatus',
    label: 'Relationship Status',
    question: 'What is your relationship status?',
    options: ['Single', 'In a relationship', 'Married', "It's complicated", 'Separated', 'Divorced', 'Widowed'],
  },
  {
    id: 'reasonsForTherapy',
    label: 'Reasons for Therapy',
    question: 'Why are you here today?',
    options: [
      'Just exploring',
      'I feel anxious or overwhelmed',
      "I've been feeling depressed",
      'My mood is interfering with my job/school performance',
      'I want to gain self-confidence',
      'I need to talk through a specific challenge',
      'I have experienced trauma',
      'Recommended to me (friend, family, doctor)',
    ],
    multi: true,
  },
  {
    id: 'experiencedAnxiety',
    label: 'Experienced Anxiety, Panic Attacks, or Phobias',
    question: 'Experienced anxiety, panic attacks, or phobias?',
    options: ['Yes', 'No'],
  },
  {
    id: 'currentlyTakingMedication',
    label: 'Currently Taking Medication',
    question: 'Are you currently taking medication?',
    options: ['Yes', 'No'],
  },
  {
    id: 'historyOfAlcoholUse',
    label: 'History of Alcohol Use',
    question: 'Do you have a history of alcohol use?',
    options: ['Yes', 'No'],
  },
  {
    id: 'historyOfMarijuanaUse',
    label: 'History of Marijuana Use',
    question: 'Do you have a history of marijuana use?',
    options: ['Yes', 'No'],
  },
  {
    id: 'ethnicity',
    label: 'Ethnicity',
    question: 'What is your ethnicity?',
    options: [
      'White',
      'Black or African American',
      'Hispanic or Latino',
      'Asian',
      'Middle Eastern',
      'Native American',
      'Pacific Islander',
      'Mixed',
      'Other',
      'Prefer not to say',
    ],
  },
  {
    id: 'sleepingHabits',
    label: 'Sleeping Habits',
    question: 'How are your sleeping habits?',
    options: ['Good', 'Fair', 'Poor'],
  },
  {
    id: 'therapyGoals',
    label: 'Therapy Goals',
    question: 'What are your goals for therapy?',
    options: [
      'Reduce anxiety and stress',
      'Build self-confidence',
      'Improve mood and depression',
      'Develop healthy relationships',
      'Overcome trauma',
      'Manage emotions better',
      'Improve communication',
      'Better work-life balance',
      'Develop coping strategies',
      'Improve sleep quality',
      'Manage anger',
      'Personal growth',
    ],
    multi: true,
  },
];

type IntakeAnswers = Partial<Record<StepId, IntakeValue>>;

function hasAnswer(step: Step, value: IntakeValue | undefined) {
  if (step.multi) {
    return Array.isArray(value) && value.length > 0;
  }

  return typeof value === 'string' && value.length > 0;
}

function formatReview(answers: IntakeAnswers) {
  return STEPS.map((step) => {
    const value = answers[step.id];
    const formattedValue = Array.isArray(value) ? value.join(', ') : value;
    return `${step.label}: ${formattedValue}.`;
  }).join('\n');
}

function ChoiceChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  if (selected) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <LinearGradient
          colors={['#4A86C8', '#D634E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.selectedChip}
        >
          <Text style={styles.chipLabel}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.chip}
    >
      <Text style={styles.chipLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function IntakeScreen() {
  const insets = useSafeAreaInsets();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<IntakeAnswers>({});
  const [submitting, setSubmitting] = useState(false);

  const step = STEPS[stepIndex];
  const currentValue = answers[step.id];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;
  const canContinue = hasAnswer(step, currentValue);
  const buttonLabel = stepIndex === STEPS.length - 1 ? 'Submit' : 'Next';

  const selectedValues = useMemo(
    () => (Array.isArray(currentValue) ? currentValue : typeof currentValue === 'string' ? [currentValue] : []),
    [currentValue]
  );

  const handleSelect = (option: string) => {
    setAnswers((prev) => {
      if (step.multi) {
        const existing = Array.isArray(prev[step.id]) ? (prev[step.id] as string[]) : [];
        const nextValues = existing.includes(option)
          ? existing.filter((item) => item !== option)
          : [...existing, option];

        return {
          ...prev,
          [step.id]: nextValues,
        };
      }

      return {
        ...prev,
        [step.id]: option,
      };
    });
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      router.back();
      return;
    }

    setStepIndex((current) => current - 1);
  };

  const handleNext = async () => {
    if (!canContinue || submitting) {
      return;
    }

    if (stepIndex < STEPS.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }

    try {
      setSubmitting(true);
      const review = formatReview(answers);
      await createIntakeReview(review);
      Alert.alert('Intake Saved', 'Your intake has been submitted.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save intake.';
      Alert.alert('Submission Failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#171719]">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: insets.top + 4, paddingBottom: 188 }}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
          >
            <ChevronLeft size={36} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>Intake</Text>

          <Text style={styles.stepLabel}>
            Step {stepIndex + 1} of {STEPS.length}
          </Text>

          <View style={styles.progressTrack}>
            <LinearGradient
              colors={['#4A86C8', '#D634E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>

          <Text style={styles.question}>{step.question}</Text>

          <View style={styles.chipWrap}>
            {step.options.map((option) => (
              <ChoiceChip
                key={option}
                label={option}
                selected={selectedValues.includes(option)}
                onPress={() => handleSelect(option)}
              />
            ))}
          </View>

          {step.multi && (
            <Text style={styles.helperText}>
              Select all that apply.
            </Text>
          )}
        </ScrollView>

        <View className="absolute left-0 right-0 px-5" style={{ bottom: insets.bottom + 88 }}>
          <TouchableOpacity
            onPress={handleNext}
            disabled={!canContinue || submitting}
            activeOpacity={0.9}
            style={!canContinue || submitting ? styles.disabledButton : undefined}
          >
            <LinearGradient
              colors={['#4A86C8', '#D634E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButton}
            >
              {submitting ? (
                <ActivityIndicator color="white" size="large" />
              ) : (
                <Text style={styles.nextButtonLabel}>{buttonLabel}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#101114',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    color: 'white',
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '800',
    marginBottom: 22,
  },
  stepLabel: {
    color: '#9CA3AF',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#3A3A3C',
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  question: {
    color: 'white',
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    marginBottom: 14,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: -12,
  },
  chip: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#343436',
    borderWidth: 1,
    borderColor: '#39404D',
  },
  selectedChip: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginRight: 8,
    marginBottom: 8,
  },
  chipLabel: {
    color: 'white',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
  helperText: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButton: {
    minHeight: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonLabel: {
    color: 'white',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
  },
});
