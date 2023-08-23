module Fastlane
  module Actions
    module SharedValues
      GET_UPLOAD_KEY_SIGNING_FROM_GRADLE_PROPERTIES_VALUE = :GET_UPLOAD_KEY_SIGNING_FROM_GRADLE_PROPERTIES_VALUE
    end

    class GetUploadKeySigningFromGradlePropertiesAction < Action
      def self.run(params)
        properties_path = params[:path]
        UI.message "Reading Gradle Properties From: #{properties_path}"
        properties = parse_properties(properties_path)
        Actions.lane_context[SharedValues::GET_UPLOAD_KEY_SIGNING_FROM_GRADLE_PROPERTIES_VALUE] = properties
        properties
      end

      def self.parse_properties(path)
        properties = Hash.new
        File.open(path, 'r') do |file|
          file.each_line do |line|
            if line.include? "UPLOAD_STORE_FILE"
              m = line.match(/^(.*)=(.*)$/)
              key = m[1]
              value = m[2]
              UI.message("#{line}: #{key}=#{value}")
              properties[:UPLOAD_STORE_FILE] = value
              UI.message(" -> UPLOAD_STORE_FILE: (#{value})")
            elsif line.include? "UPLOAD_KEY_ALIAS"
              m = line.match(/^(.*)=(.*)$/)
              key = m[1]
              value = m[2]
              properties[:UPLOAD_KEY_ALIAS] = value
              UI.message(" -> UPLOAD_KEY_ALIAS: (#{value})")
            elsif line.include? "UPLOAD_STORE_PASSWORD"
              m = line.match(/^(.*)=(.*)$/)
              key = m[1]
              value = m[2]
              properties[:UPLOAD_STORE_PASSWORD] = value
              UI.message(" -> UPLOAD_STORE_PASSWORD: ****")
            end
          end
          file.close
        end
        properties
      end

      #####################################################
      # @!group Documentation
      #####################################################

      def self.description
        "Reads the gradle.properties values for upload key signing info"
      end

      def self.details
        # Optional:
        # this is your chance to provide a more detailed description of this action
        ""
      end

      def self.available_options
        # Define all options your action supports.

        # Below a few examples
        [
          FastlaneCore::ConfigItem.new(
            key: :path,
            env_name: "GRADLE_PROPERTIES_FILE_PATH",
            description: "gradle.properties file path",
            optional: false,
            type: String,
            default_value: "gradle.properties",
            verify_block: proc do |value|
              UI.user_error!("Couldn't find file at path '#{value}'") unless File.exist?(value)
            end)
        ]
      end

      def self.output
        # Define the shared values you are going to provide
        # Example
        [
          ['GET_UPLOAD_KEY_SIGNING_FROM_GRADLE_PROPERTIES_VALUE', 'A hash with signing information']
        ]
      end

      def self.return_value
        # If your method provides a return value, you can describe here what it does
        "A hash with signing information"
      end

      def self.authors
        # So no one will ever forget your contribution to fastlane :) You are awesome btw!
        ["RichardMarks"]
      end

      def self.is_supported?(platform)
        platform == :android
      end
    end
  end
end
