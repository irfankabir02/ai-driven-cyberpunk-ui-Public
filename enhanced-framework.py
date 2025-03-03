import os
import json
import datetime
import matplotlib.pyplot as plt
from colorama import init, Fore, Style

# Initialize colorama for colored terminal output
init()

class EnhancedProblemFramework:
    def __init__(self, problem=None):
        self.problem = problem
        self.steps = {
            1: "Clarify the problem",
            2: "Research and gather information",
            3: "Identify components and unknowns",
            4: "Determine key relevance",
            5: "Prioritize and plan strategic actions",
            6: "Test and refine (scope and refinement)"
        }
        self.data = {}
        self.iterations = []
        self.session_id = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        self.session_path = f"problem_sessions/{self.session_id}"
        
        # Create sessions directory if it doesn't exist
        if not os.path.exists("problem_sessions"):
            os.makedirs("problem_sessions")
        
        if not os.path.exists(self.session_path):
            os.makedirs(self.session_path)

    def _print_header(self, text):
        """Print a formatted header for steps"""
        print(f"\n{Fore.CYAN}=== {text} ==={Style.RESET_ALL}")
    
    def _print_instruction(self, text):
        """Print a formatted instruction"""
        print(f"{Fore.YELLOW}{text}{Style.RESET_ALL}")
    
    def _get_input(self, prompt):
        """Get multiline input from user"""
        self._print_instruction(prompt)
        print(f"{Fore.GREEN}(Enter your response, type 'DONE' on a new line when finished){Style.RESET_ALL}")
        lines = []
        while True:
            line = input()
            if line.strip().upper() == "DONE":
                break
            lines.append(line)
        return "\n".join(lines)

    def step_1_clarify_problem(self):
        self._print_header("STEP 1: Clarify the Problem")
        self._print_instruction("Define exactly what issue you need to solve or what question you need to answer.")
        self.data[1] = self._get_input("What is the specific problem you're trying to solve?")

    def step_2_gather_info(self):
        self._print_header("STEP 2: Research and Gather Information")
        self._print_instruction("Learn as much as possible about the problem's context.")
        self.data[2] = self._get_input("What information, facts, or resources have you gathered about this problem?")

    def step_3_identify_components(self):
        self._print_header("STEP 3: Identify Components and Unknowns")
        self._print_instruction("Break the problem into parts and identify what you don't know.")
        self.data[3] = self._get_input("What are the sub-problems, causes, or key elements involved? What don't you know yet?")

    def step_4_determine_relevance(self):
        self._print_header("STEP 4: Determine Key Relevance")
        self._print_instruction("Filter the information to identify what's most important.")
        self.data[4] = self._get_input("Which factors are driving the core problem? Which elements are most significant?")

    def step_5_prioritize_plan(self):
        self._print_header("STEP 5: Prioritize and Plan Strategic Actions")
        self._print_instruction("Choose the most relevant solution approaches and plan next steps.")
        self.data[5] = self._get_input("What solutions or actions will you take, and in what order?")

    def step_6_test_refine(self):
        self._print_header("STEP 6: Test and Refine")
        self._print_instruction("Implement a solution on a small scale, then evaluate and refine it.")
        self.data[6] = self._get_input("How will you test your plan? What metrics will you use to evaluate success?")
        
        refinement = self._get_input("After testing, what did you learn? How would you refine your approach?")
        self.data['refinement'] = refinement
    
    def save_session(self):
        """Save the current session data to a JSON file"""
        iteration_data = {
            "problem": self.problem,
            "timestamp": datetime.datetime.now().isoformat(),
            "data": self.data
        }
        
        self.iterations.append(iteration_data)
        
        # Save to file
        with open(f"{self.session_path}/session_data.json", "w") as f:
            json.dump({
                "session_id": self.session_id,
                "problem": self.problem,
                "iterations": self.iterations
            }, f, indent=4)
        
        print(f"{Fore.GREEN}Session saved successfully to {self.session_path}/session_data.json{Style.RESET_ALL}")
    
    def load_session(self, session_id):
        """Load a previously saved session"""
        try:
            with open(f"problem_sessions/{session_id}/session_data.json", "r") as f:
                session_data = json.load(f)
                
            self.session_id = session_data["session_id"]
            self.problem = session_data["problem"]
            self.iterations = session_data["iterations"]
            
            # Set current data to the latest iteration
            if self.iterations:
                self.data = self.iterations[-1]["data"]
                
            self.session_path = f"problem_sessions/{self.session_id}"
            print(f"{Fore.GREEN}Session {session_id} loaded successfully.{Style.RESET_ALL}")
            return True
        except Exception as e:
            print(f"{Fore.RED}Error loading session: {e}{Style.RESET_ALL}")
            return False
    
    def visualize_progress(self):
        """Create a simple visualization of the framework progress"""
        if not self.data:
            print(f"{Fore.RED}No data to visualize. Complete at least one iteration first.{Style.RESET_ALL}")
            return
        
        # Create a simple completion chart
        steps_completed = len(self.data)
        completion_percentage = (steps_completed / 7) * 100  # 6 steps + refinement
        
        labels = []
        status = []
        
        for step_num in range(1, 7):
            labels.append(f"Step {step_num}")
            status.append(1 if step_num in self.data else 0)
        
        if 'refinement' in self.data:
            labels.append("Refinement")
            status.append(1)
        else:
            labels.append("Refinement")
            status.append(0)
        
        # Create the visualization
        plt.figure(figsize=(10, 6))
        plt.bar(labels, status, color=['green' if s == 1 else 'red' for s in status])
        plt.title(f"Problem Dissection Progress: {completion_percentage:.1f}% Complete")
        plt.ylim(0, 1.2)
        plt.savefig(f"{self.session_path}/progress_visualization.png")
        
        print(f"{Fore.GREEN}Progress visualization saved to {self.session_path}/progress_visualization.png{Style.RESET_ALL}")
    
    def export_report(self):
        """Export a formatted report of the current session"""
        if not self.data:
            print(f"{Fore.RED}No data to export. Complete at least one iteration first.{Style.RESET_ALL}")
            return
        
        report = []
        report.append("# Problem Dissection Framework Report")
        report.append(f"Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"\n## Problem Statement\n{self.problem}")
        
        for step_num in range(1, 7):
            if step_num in self.data:
                report.append(f"\n## Step {step_num}: {self.steps[step_num]}\n{self.data[step_num]}")
        
        if 'refinement' in self.data:
            report.append(f"\n## Refinement & Learning\n{self.data['refinement']}")
        
        report.append("\n## Next Steps")
        report.append("- [ ] Review the current iteration")
        report.append("- [ ] Apply refinements from testing")
        report.append("- [ ] Start next iteration with updated understanding")
        
        # Save the report
        with open(f"{self.session_path}/framework_report.md", "w") as f:
            f.write("\n".join(report))
        
        print(f"{Fore.GREEN}Report exported to {self.session_path}/framework_report.md{Style.RESET_ALL}")
        
    def summarize_session(self):
        """Display a summary of the current session"""
        if not self.data:
            print(f"{Fore.RED}No data to summarize. Complete at least one iteration first.{Style.RESET_ALL}")
            return
        
        self._print_header("SESSION SUMMARY")
        print(f"{Fore.WHITE}Problem: {self.problem}{Style.RESET_ALL}")
        
        for step_num in range(1, 7):
            if step_num in self.data:
                print(f"\n{Fore.CYAN}Step {step_num}: {self.steps[step_num]}{Style.RESET_ALL}")
                # Print a preview (first 100 chars) of the data for this step
                preview = self.data[step_num][:100] + "..." if len(self.data[step_num]) > 100 else self.data[step_num]
                print(preview)
        
        if 'refinement' in self.data:
            print(f"\n{Fore.CYAN}Refinement & Learning:{Style.RESET_ALL}")
            preview = self.data['refinement'][:100] + "..." if len(self.data['refinement']) > 100 else self.data['refinement']
            print(preview)
    
    def run_framework(self):
        """Run the complete framework process"""
        if not self.problem:
            self.problem = input(f"{Fore.CYAN}Enter the problem you want to analyze: {Style.RESET_ALL}")
        
        print(f"{Fore.GREEN}Starting problem dissection framework for: {self.problem}{Style.RESET_ALL}")
        
        self.step_1_clarify_problem()
        self.step_2_gather_info()
        self.step_3_identify_components()
        self.step_4_determine_relevance()
        self.step_5_prioritize_plan()
        self.step_6_test_refine()
        
        self.save_session()
        self.summarize_session()
        
        while True:
            print(f"\n{Fore.CYAN}What would you like to do next?{Style.RESET_ALL}")
            print("1. Visualize progress")
            print("2. Export report")
            print("3. Start new iteration")
            print("4. Exit")
            
            choice = input("Enter your choice (1-4): ")
            
            if choice == "1":
                self.visualize_progress()
            elif choice == "2":
                self.export_report()
            elif choice == "3":
                # Save current data as an iteration
                self.save_session()
                # Start a new iteration with the same problem
                self.data = {}
                self.run_framework()
            elif choice == "4":
                print(f"{Fore.GREEN}Exiting framework. Your session has been saved.{Style.RESET_ALL}")
                break
            else:
                print(f"{Fore.RED}Invalid choice. Please try again.{Style.RESET_ALL}")

def list_saved_sessions():
    """List all saved sessions"""
    if not os.path.exists("problem_sessions"):
        print(f"{Fore.RED}No saved sessions found.{Style.RESET_ALL}")
        return None
    
    sessions = os.listdir("problem_sessions")
    if not sessions:
        print(f"{Fore.RED}No saved sessions found.{Style.RESET_ALL}")
        return None
    
    print(f"{Fore.CYAN}Available sessions:{Style.RESET_ALL}")
    for i, session_id in enumerate(sessions, 1):
        try:
            with open(f"problem_sessions/{session_id}/session_data.json", "r") as f:
                session_data = json.load(f)
                problem = session_data.get("problem", "Unknown problem")
                iterations = len(session_data.get("iterations", []))
                print(f"{i}. {session_id} - Problem: {problem} ({iterations} iterations)")
        except:
            print(f"{i}. {session_id} - Could not read session data")
    
    return sessions

def main_menu():
    """Display the main menu and handle user choices"""
    while True:
        print(f"\n{Fore.CYAN}===== PROBLEM DISSECTION FRAMEWORK =====\n{Style.RESET_ALL}")
        print("1. Start a new problem analysis")
        print("2. Load a saved session")
        print("3. Exit")
        
        choice = input("Enter your choice (1-3): ")
        
        if choice == "1":
            problem = input(f"{Fore.CYAN}Enter the problem you want to analyze: {Style.RESET_ALL}")
            framework = EnhancedProblemFramework(problem)
            framework.run_framework()
        elif choice == "2":
            sessions = list_saved_sessions()
            if sessions:
                session_num = input("Enter the number of the session to load: ")
                try:
                    session_index = int(session_num) - 1
                    if 0 <= session_index < len(sessions):
                        framework = EnhancedProblemFramework()
                        if framework.load_session(sessions[session_index]):
                            framework.summarize_session()
                            framework.run_framework()
                    else:
                        print(f"{Fore.RED}Invalid session number.{Style.RESET_ALL}")
                except ValueError:
                    print(f"{Fore.RED}Please enter a valid number.{Style.RESET_ALL}")
        elif choice == "3":
            print(f"{Fore.GREEN}Thank you for using the Problem Dissection Framework. Goodbye!{Style.RESET_ALL}")
            break
        else:
            print(f"{Fore.RED}Invalid choice. Please try again.{Style.RESET_ALL}")

if __name__ == "__main__":
    try:
        main_menu()
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Program interrupted. Exiting.{Style.RESET_ALL}")
    except Exception as e:
        print(f"{Fore.RED}An error occurred: {e}{Style.RESET_ALL}")
