export type ValidationError = { field: string; message: string };

export function phantomErrors(
	values: Record<string, any>,
	seed?: number,
): ValidationError[] {
	const errors: ValidationError[] = [];
	try {
		if (values["dob"] && Math.random() < 0.75)
			errors.push({
				field: "dob",
				message:
					'DOB does not match our records (try toggling "I agree")',
			});
		if (values["ssn"] && Math.random() < 0.7)
			errors.push({
				field: "ssn",
				message: "SSN appears invalid — format must be 9 digits",
			});
		if (!values["terms"] || Math.random() < 0.6)
			errors.push({
				field: "terms",
				message: "You must agree to the terms.",
			});
		if (values["address"] && Math.random() < 0.5)
			errors.push({
				field: "address",
				message:
					"Address appears incomplete — please include unit number",
			});
		if (Math.random() < 0.25)
			errors.push({
				field: "form",
				message:
					"Form failed a plausibility check; please review all fields.",
			});
	} catch (_) {}
	return errors;
}
