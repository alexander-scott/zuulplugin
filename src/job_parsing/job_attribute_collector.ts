import { JobManager } from "./job_manager";
import { Job } from "../data_structures/job";
import { Attribute } from "../data_structures/attribute";
import { NewJob } from "../file_parsing/file_parser";

/**
 * Collects all the attributes for this job, starting with the top level parent.
 * Child attributes with the same key overwrite parent attributes.
 */
export class JobAttributeCollector {
	static get_attributes_for_job(job: NewJob, job_manager: JobManager): { [id: string]: string | boolean } {
		let attributes: { [id: string]: string | boolean } = {};
		let parents: string[] = [job.get_name_value()];

		let current_parent_attribute = job.get_parent_value();
		while (current_parent_attribute) {
			let current_parent_name = current_parent_attribute;

			parents.push(current_parent_name);
			current_parent_attribute = undefined;

			let next_parent = job_manager.get_job_with_name(current_parent_name);
			if (next_parent) {
				current_parent_attribute = next_parent.get_parent_value();
			}
		}

		while (parents.length > 0) {
			let parent_name = parents.pop();
			if (parent_name) {
				let parent = job_manager.get_job_with_name(parent_name);
				if (parent) {
					let values = parent.get_all_attributes_with_values();
					// values.forEach((val) => {
					// 	let str = val.key as string;
					// 	attributes[str] = val.value;
					// });
					for (let key in values) {
						attributes[key] = values[key];
					}
				}
			}
		}
		return attributes;
	}
}
