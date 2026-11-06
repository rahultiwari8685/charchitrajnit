import { Suspense } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function ThemeSwitcherServer() {
    return (
        <Suspense fallback={
            <div className="dark-light-switcher">
                <svg className="svg-dark dark-mode-invert" xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
                    <path d="M10.0018 0.666992C4.85543 0.666992 0.666656 4.85439 0.666656 10.0008C0.666656 15.1471 4.85543 19.3359 10.0018 19.3359C15.1482 19.3359 19.337 15.1471 19.337 10.0008C19.337 4.85439 15.1482 0.666992 10.0018 0.666992ZM10.7212 2.13662C14.7526 2.49852 17.8982 5.87302 17.8982 10.0008C17.8982 14.1285 14.7526 17.503 10.7212 17.8649V2.13662Z" fill="#0E0E0F" />
                </svg>
            </div>
        }>
            <ThemeSwitcher />
        </Suspense>
    );
}

