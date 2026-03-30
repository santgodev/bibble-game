import type { TriviaQuestion } from './categories';
import { TRIVIA_GENESIS } from './pentateuco/genesis';
import { TRIVIA_EXODO } from './pentateuco/exodo';
import { TRIVIA_LEVITICO } from './pentateuco/levitico';
import { TRIVIA_NUMEROS } from './pentateuco/numeros';
import { TRIVIA_DEUTERONOMIO } from './pentateuco/deuteronomio';

export const TRIVIA_PENTATEUCO: TriviaQuestion[] = [
    ...TRIVIA_GENESIS,
    ...TRIVIA_EXODO,
    ...TRIVIA_LEVITICO,
    ...TRIVIA_NUMEROS,
    ...TRIVIA_DEUTERONOMIO
];
