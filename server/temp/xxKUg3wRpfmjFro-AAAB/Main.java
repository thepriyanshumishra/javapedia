import java.util.Scanner;

public class BasicCalculator {
    public static void main(String[] args) {
        // Use try-with-resources to automatically close the scanner
        try (Scanner input = new Scanner(System.in)) {
            double num1, num2, result;
            char operator;

            System.out.print("Enter the first number: ");
            // Check if there is actually a number to read
            if (!input.hasNextDouble()) {
                System.out.println("Error: That's not a valid number.");
                return;
            }
            num1 = input.nextDouble();

            System.out.print("Enter the operator (+, -, *, /): ");
            operator = input.next().charAt(0);

            System.out.print("Enter the second number: ");
            if (!input.hasNextDouble()) {
                System.out.println("Error: That's not a valid number.");
                return;
            }
            num2 = input.nextDouble();

            // Perform calculation
            switch (operator) {
                case '+':
                    result = num1 + num2;
                    System.out.println(num1 + " + " + num2 + " = " + result);
                    break;
                case '-':
                    result = num1 - num2;
                    System.out.println(num1 + " - " + num2 + " = " + result);
                    break;
                case '*':
                    result = num1 * num2;
                    System.out.println(num1 + " * " + num2 + " = " + result);
                    break;
                case '/':
                    if (num2 != 0) {
                        result = num1 / num2;
                        System.out.println(num1 + " / " + num2 + " = " + result);
                    } else {
                        System.out.println("Error! Division by zero is not allowed.");
                    }
                    break;
                default:
                    System.out.println("Error! '" + operator + "' is an invalid operator.");
            }
        } // Scanner closes automatically here
    }
}