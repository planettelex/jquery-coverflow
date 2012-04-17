# Build command utilizing Maven
Execute these commands from a terminal prompt within the project directory.

## Adding or updating the license in files.
Execute the following command.

    $> mvn license:format

## Building the jquery.ui.pt_coverflow-combined.min.js
Execute the following command.

    $> mvn process-resources -Pcombine

## Packaging for release
Execute the following command.

    $> mvn clean package -Prelease

## Upload release to Github

Add a profile in your ~/.m2/settings.xml like so.

	<profiles>
        <profile>
            <id>github</id>
            <properties>
	    	    <github.global.userName>{Put your Github username here}</github.global.userName>
		        <github.global.password>{Put your Github password here}</github.global.password>
            </properties>
        </profile>
    </profiles>

Execute the following command. (dryRun is *true* by default)

	$> mvn clean package -Prelease,deploy,github -DdryRun=false
