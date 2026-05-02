'use client';

import { Text } from '@/types';
import LessonSteps from './LessonSteps';

interface Props {
  text: Text;
}

export default function LessonView({ text }: Props) {
  return <LessonSteps text={text} />;
}
