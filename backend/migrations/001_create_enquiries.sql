
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,
    phone VARCHAR(32) NOT NULL,

    fitness_goal VARCHAR(100),
    preferred_contact_method VARCHAR(20),
    message VARCHAR(2000),

    privacy_consent BOOLEAN NOT NULL
        CHECK (privacy_consent = TRUE),

    privacy_consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    idempotency_key UUID NOT NULL UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT enquiries_preferred_contact_method_check
        CHECK (
            preferred_contact_method IS NULL
            OR preferred_contact_method IN ('phone', 'whatsapp', 'email')
        )
);

CREATE INDEX IF NOT EXISTS enquiries_created_at_idx
    ON enquiries (created_at DESC);
